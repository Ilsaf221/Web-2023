const uploadTitle = document.getElementById('title');
const uploadDescription = document.getElementById('description');
const uploadAuthorName = document.getElementById('author_name');
const uploadPublishDate = document.getElementById('publish_date');
const uploadAuthorPhoto = document.getElementById("author_photo");
const uploadImage = document.getElementById("hero_image_10mb");
const uploadImageTiny = document.getElementById("hero_image_5mb");
const uploadContent = document.getElementById("content");

const removeAuthorPhoto = document.querySelector(".form__remove-author-photo");
const removeImages = document.getElementById("hero_image_remove");

const defaultTitle = 'New Post';
const defaultDescription = 'Please, enter any description';
const defaultName = 'Enter author name';
const defaultDate = '19/04/2023';
const defaultAuthorPhoto = "../static/img/upload_avatar.png";
const defaultImage = "../static/img/hero_image_10mb.png";
const defaultPreviewImage = "../static/img/article_preview_image.png";
const defaultImageTiny = "../static/img/hero_image_5mb.png";
const defaultPreviewImageTiny = "../static/img/post_card_preview_image.png";

const publishButton = document.querySelector(".button");

let authorAvatar;
let authorPhotoName;

let articleImage;
let articleImageName
let postCardImage;
let postCardImageName;


uploadTitle.addEventListener(
  "input",
  () => {
    const titlePreview = document.getElementById('titlePreview');
    const titlePreviewTiny = document.getElementById('titlePreviewTiny');
    let title = document.getElementById('title').value;
    if (title !== '' && title.length < 25) {
      titlePreview.innerHTML = title;
      titlePreviewTiny.innerHTML = title;
    }
    else {
      titlePreview.innerHTML = defaultTitle;
      titlePreviewTiny.innerHTML = defaultTitle;
    }
  }
)

uploadDescription.addEventListener(
  "input",
  () => {
    const descriptionPreview = document.getElementById('subtitlePreview');
    const descriptionPreviewTiny = document.getElementById('subtitlePreviewTiny');
    let description = document.getElementById('description').value;
    if (description !== '' && description.length < 60) {
      descriptionPreview.innerHTML = description;
      descriptionPreviewTiny.innerHTML = description;
    }
    else {
      descriptionPreview.innerHTML = defaultDescription;
      descriptionPreviewTiny.innerHTML = defaultDescription;
    }
  }
)

uploadAuthorName.addEventListener(
  "input",
  () => {
    const namePreview = document.getElementById('authorNamePreviewTiny');
    let name = document.getElementById('author_name').value;
    if (name !== '' && name.length < 25) {
      namePreview.innerHTML = name;
    }
    else {
      namePreview.innerHTML = defaultName;
    }
  }
)

uploadPublishDate.addEventListener(
  "input",
  () => {
    const datePreview = document.getElementById('publishDatePreviewTiny');
    let date = document.getElementById('publish_date').value;
    if (date !== '') {
      datePreview.innerHTML = date;
    }
    else {
      datePreview.innerHTML = defaultDate;
    }
  }
)

uploadAuthorPhoto.addEventListener(
  "input",
  () => {
    const authorPhotoPreviewTiny = document.querySelector(".inner-post-card-box__author-image");
    const authorPhoto = document.getElementById("author_image");
    const uploadAuthorPhotoButton = document.querySelector(".form__upload");
    const uploadIcon = document.querySelector(".upload-author-photo-icon");
    const removeButton = document.querySelector(".form__remove-author-photo");
    const file = document.getElementById("author_photo").files[0];
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        authorPhotoPreviewTiny.src = reader.result;
        authorPhoto.src = reader.result;
        authorAvatar = reader.result.replace("data:", "").replace(/^.+,/, "");
        authorPhotoName = file.name
      },
      false
    );
    removeButton.classList.add("remove-author-photo__remove-author-photo-show");
    uploadAuthorPhotoButton.innerHTML = 'Upload New';
    uploadAuthorPhotoButton.classList.add("form__upload-author-photo-button-view");
    uploadIcon.classList.add("upload-author-photo-icon-show");
    if (file) {
      reader.readAsDataURL(file);
    }
  }
)

removeAuthorPhoto.addEventListener(
  "click",
  (event) => {
    event.preventDefault();
    const authorPhotoPreviewTiny = document.querySelector(".inner-post-card-box__author-image");
    const authorPhoto = document.getElementById("author_image");
    const uploadAuthorPhotoButton = document.querySelector(".form__upload");
    const uploadIcon = document.querySelector(".upload-author-photo-icon");
    const removeButton = document.querySelector(".form__remove-author-photo")

    removeButton.classList.remove("remove-button__remove-button-show");
    uploadAuthorPhotoButton.innerHTML = 'Upload';
    uploadAuthorPhotoButton.classList.remove("form__upload-author-photo-button-view");
    uploadIcon.classList.remove("upload-author-photo-icon-show");
    authorPhotoPreviewTiny.src = defaultAuthorPhoto;
    authorPhoto.src = defaultAuthorPhoto;
  }
)

uploadImage.addEventListener(
  "input",
  () => {
    const imagePreview = document.querySelector(".inner-article-box__image-place");
    const imageInput = document.getElementById("hero_image");
    const imagePreviewTiny = document.querySelector(".inner-post-card-box__image-place");
    const imageInputTiny = document.getElementById("hero_image_tiny");
    const imageButtons = document.querySelector(".form__hero-image-10mb-buttons");
    const imageTinyButtons = document.querySelector(".form__hero-image-5mb-buttons");
    const imageCaption = document.querySelector(".form__hero-image-10mb-caption");
    const imageTinyCaption = document.querySelector(".form__hero-image-5mb-caption");

    const file = document.getElementById("hero_image_10mb").files[0];
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        imagePreview.src = reader.result;
        imageInput.src = reader.result;
        imagePreviewTiny.src = reader.result;
        imageInputTiny.src = reader.result;
        articleImage = reader.result.replace("data:", "").replace(/^.+,/, "");
        articleImageName = file.name;

        imageButtons.classList.add("form__hero-image-10mb-buttons-show");
        imageCaption.classList.add("form__hero-image-10mb-caption-hide");
        imageTinyButtons.classList.add("form__hero-image-5mb-buttons-show");
        imageTinyCaption.classList.add("form__hero-image-5mb-caption-hide");
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }
);


uploadImageTiny.addEventListener(
  "input",
  () => {
    const imagePreview = document.querySelector(".inner-article-box__image-place");
    const imageInput = document.getElementById("hero_image");
    const imagePreviewTiny = document.querySelector(".inner-post-card-box__image-place");
    const imageInputTiny = document.getElementById("hero_image_tiny");
    const imageButtons = document.querySelector(".form__hero-image-10mb-buttons");
    const imageTinyButtons = document.querySelector(".form__hero-image-5mb-buttons");
    const imageCaption = document.querySelector(".form__hero-image-10mb-caption");
    const imageTinyCaption = document.querySelector(".form__hero-image-5mb-caption");
    const file = document.getElementById("hero_image_5mb").files[0];
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        imagePreview.src = reader.result;
        imageInput.src = reader.result;
        imagePreviewTiny.src = reader.result;
        imageInputTiny.src = reader.result;
        articleImage = reader.result.replace("data:", "").replace(/^.+,/, "");
        articleImageName = file.name;

        imageButtons.classList.add("form__hero-image-10mb-buttons-show");
        imageCaption.classList.add("form__hero-image-10mb-caption-hide");
        imageTinyButtons.classList.add("form__hero-image-5mb-buttons-show");
        imageTinyCaption.classList.add("form__hero-image-5mb-caption-hide");
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }
)

removeImages.addEventListener(
  "click",
  (event) => {
    event.preventDefault();
    const imageButtons = document.querySelector(".form__hero-image-10mb-buttons");
    const imageTinyButtons = document.querySelector(".form__hero-image-5mb-buttons");
    const imageCaption = document.querySelector(".form__hero-image-10mb-caption");
    const imageTinyCaption = document.querySelector(".form__hero-image-5mb-caption");
    const imagePreview = document.querySelector(".inner-article-box__image-place");
    const imageInput = document.getElementById("hero_image");
    const imagePreviewTiny = document.querySelector(".inner-post-card-box__image-place");
    const imageInputTiny = document.getElementById("hero_image_tiny");

    imageButtons.classList.remove("form__hero-image-10mb-buttons-show");
    imageCaption.classList.remove("form__hero-image-10mb-caption-hide");
    imageTinyButtons.classList.remove("form__hero-image-5mb-buttons-show");
    imageTinyCaption.classList.remove("form__hero-image-5mb-caption-hide");
    imagePreview.src = defaultPreviewImage;
    imageInput.src = defaultImage;
    imagePreviewTiny.src = defaultPreviewImageTiny;
    imageInputTiny.src = defaultImageTiny;
  }
)

publishButton.addEventListener(
  "click",
  (event) => {
    event.preventDefault();
    const data = {
      title: uploadTitle.value,
      subtitle: uploadDescription.value,
      authorName: uploadAuthorName.value,
      authorImg: authorPhotoName,
      authorImgContent: authorAvatar,
      publishDate: uploadPublishDate.value,
      Img: articleImageName,
      ImgContent: articleImage,
      content: uploadContent.value,
    }
    doFetch(data);
  }
)

async function doFetch(data) {
  const response = await fetch("/api/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    },
    body: JSON.stringify(data, null, "\t")
  });
  if (!response.ok) {
    alert("Ошибка HTTP: " + response.status);
  }
}