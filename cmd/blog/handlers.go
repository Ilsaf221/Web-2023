package main

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

type indexPageData struct {
	FeaturedPosts   []featuredPostData
	MostResentPosts []mostRecentPostData
}

type adminPageData struct{}

type loginPageData struct{}

type createPostRequest struct {
	Title            string `json:"title"`
	Subtitle         string `json:"subtitle"`
	Author           string `json:"authorName"`
	AuthorImg        string `json:"authorImg"`
	AuthorImgContent string `json:"authorImgContent"`
	PublishDate      string `json:"publishDate"`
	Img              string `json:"Img"`
	ImgContent       string `json:"ImgContent"`
	Content          string `json:"content"`
}

type featuredPostData struct {
	PostID      string `db:"post_id"`
	ImgModifier string `db:"image_modifier"`
	Img         string `db:"image_url"`
	Title       string `db:"title"`
	Subtitle    string `db:"subtitle"`
	AuthorImg   string `db:"author_url"`
	Author      string `db:"author"`
	PublishDate string `db:"publish_date"`
	PostURL     string
}

type mostRecentPostData struct {
	PostID      string `db:"post_id"`
	Img         string `db:"image_url"`
	Title       string `db:"title"`
	Subtitle    string `db:"subtitle"`
	AuthorImg   string `db:"author_url"`
	Author      string `db:"author"`
	PublishDate string `db:"publish_date"`
	PostURL     string
}

type postData struct {
	Title    string `db:"title"`
	Subtitle string `db:"subtitle"`
	Img      string `db:"image_url"`
	Content  string `db:"content"`
}

func index(dbx *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		mainPosts, err := featuredPosts(dbx)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		posts, err := mostRecentPosts(dbx)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		ts, err := template.ParseFiles("pages/index.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		data := indexPageData{
			FeaturedPosts:   mainPosts,
			MostResentPosts: posts,
		}

		err = ts.Execute(w, data)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		log.Println("Request completed successfully")
	}
}

func post(dbx *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		postIDStr := mux.Vars(r)["postID"]

		postID, err := strconv.Atoi(postIDStr)
		if err != nil {
			http.Error(w, "Invalid post id", 403)
			log.Println(err)
			return
		}

		post, err := postByID(dbx, postID)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "Post not found", 404)
				log.Println(err)
				return
			}

			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		ts, err := template.ParseFiles("pages/post.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		err = ts.Execute(w, post)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		log.Println("Request completed successfully")
	}
}

func admin(dbx *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		ts, err := template.ParseFiles("admin/admin.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		data := adminPageData{}

		err = ts.Execute(w, data)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		log.Println("Request completed successfully")
	}
}

func login(dbx *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		ts, err := template.ParseFiles("admin/login.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		data := loginPageData{}

		err = ts.Execute(w, data)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		log.Println("Request completed successfully")
	}
}

func featuredPosts(dbx *sqlx.DB) ([]featuredPostData, error) {
	const query = `
		SELECT
			post_id,
			title,
			subtitle,
			author,
			author_url,
			publish_date,
			image_url,
			image_modifier
		FROM
			post
		WHERE 
		  featured = 1
	`

	var posts []featuredPostData

	err := dbx.Select(&posts, query)
	if err != nil {
		return nil, err
	}

	for _, post := range posts {
		post.PostURL = "/post/" + post.PostID
	}

	log.Println(posts)

	return posts, nil
}

func mostRecentPosts(dbx *sqlx.DB) ([]mostRecentPostData, error) {
	const query = `
		SELECT
		    post_id,
			title,
			subtitle,
			author,
			author_url,
			publish_date,
			image_url
		FROM
			post
		WHERE 
		  featured = 0
	`

	var posts []mostRecentPostData

	err := dbx.Select(&posts, query)
	if err != nil {
		return nil, err
	}

	for _, post := range posts {
		post.PostURL = "/post/" + post.PostID
	}

	log.Println(posts)

	return posts, nil
}

func postByID(dbx *sqlx.DB, postID int) (postData, error) {
	const query = `
			SELECT
				title,
				subtitle,
				image_url,
				content
			FROM
				post
			WHERE 
			  post_id = ?
	`

	var post postData

	err := dbx.Get(&post, query, postID)
	if err != nil {
		return postData{}, err
	}

	return post, nil
}

func createPost(dbx *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		reqData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		var req createPostRequest

		err = json.Unmarshal(reqData, &req)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		err = savePost(dbx, req)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		log.Println("Save post request completed successfully")
	}
}

func savePost(dbx *sqlx.DB, req createPostRequest) error {

	authorImg, err := createImg(req.AuthorImg, req.AuthorImgContent)
	if err != nil {
		log.Println(err)
		return err
	}

	img, err := createImg(req.Img, req.ImgContent)
	if err != nil {
		log.Println(err)
		return err
	}

	const query = `
       INSERT INTO post
       (
           title,
           subtitle,
		   author,
		   author_url,
		   publish_date,
		   image_url,
		   content
       )
       VALUES
       (
           ?,
           ?,
		   ?,
		   ?,
		   ?,
		   ?,
		   ?		   
       )
	`

	_, err = dbx.Exec(query, req.Title, req.Subtitle, req.Author, authorImg, req.PublishDate, img, req.Content)

	return err

}

func createImg(imgName string, imgContent string) (string, error) {
	decodedAuthorImg, err := base64.StdEncoding.DecodeString(imgContent)
	if err != nil {
		log.Println(err)
		return "", err
	}

	fileAuthorImg, err := os.Create("static/img/" + imgName)
	if err != nil {
		log.Println(err)
		return "", err
	}

	_, err = fileAuthorImg.Write(decodedAuthorImg)
	if err != nil {
		log.Println(err)
		return "", err
	}
	return "/static/img/" + imgName, err
}
