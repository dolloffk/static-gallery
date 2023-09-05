"use strict";
const fs = require("fs");
const { performance } = require("perf_hooks");

let t0 = performance.now();

const imagesToPage = 10;

console.log("starting generator...");

console.log("reading page template...");
let pageTemplate = fs.readFileSync("input/template-index.html", "utf8");

let imagePageTemplate;
console.log("reading image page template...");
imagePageTemplate = fs.readFileSync("input/template-page.html", "utf8");

console.log("loading image list...");
let images = JSON.parse(fs.readFileSync("input/images.json", "utf8"));
images = images.reverse();
const numImg = images.length

let chunkedImages = [];
while (images.length !== 0) {
  chunkedImages.push(images.slice(0, imagesToPage));
  images = images.slice(imagesToPage)
}
const numPages = chunkedImages.length;

chunkedImages.forEach((chunk, index) => {
  console.log(`writing gallery page ${index + 1} of ${numPages}...`);
  let rows = [];

  chunk.forEach((img, imgIndex) => {
    if (!img.img) {
      console.log('One of your entries in images.json is missing an img property. Add it to the entry, give it the correct filename, and restart the generator.');
      process.exit();
    }
    if (!img.alt) {
      console.log(`Image ${img.img} is missing alt text. Please add some into images.json using the alt property and restart the generator.`);
      process.exit();
    }
    if (!img.desc) {
      console.log(`Image ${img.img} is missing a description. Please add some into images.json using the alt property and restart the generator.`);
      process.exit();
    }

    const pageIndex = imgIndex + (index * imagesToPage) + 1;
    const pageName = `images/${pageIndex}.html`
    rows.push(`<div class="galleryitem" id="${pageIndex}"><a href="${pageName}"><img src="img/${img.img}" alt="${img.alt}" /></a></div>`
    );
    
    let comment = img.comment
    ? `<p>Comment: ${img.comment}</p>`
    : "";

    let imagePage = imagePageTemplate;

    imagePage = imagePage.split("<!-- IMAGE -->");
    const imageDetails = `
      <h1>${img.title || 'Gallery image'}</h1>
      <div class="image">
      <p><img src="../img/${img.img}" /></p>
      <p>Image description: ${img.desc} End ID.</p>
      ${comment}
      </div>
    `
    imagePage = imagePage[0] + imageDetails + imagePage[1];

    imagePage = imagePage.split("<!-- PREVIOUS -->");
    let prevPage;
    let prevcontent = "";
    if (pageIndex > 1) {
      prevPage = pageIndex - 1;
      prevcontent = `<a href="${prevPage}.html" class="button">Previous</a>`;
    }

    imagePage = imagePage[0] + prevcontent + imagePage[1];
    
    imagePage = imagePage.split("<!-- NEXT -->");
    let nextPage;
    let nextcontent = "";
    if (pageIndex < numImg ) {
      nextPage = pageIndex + 1;
      nextcontent = `<a href="${nextPage}.html" class="button">Next</a>`;
    }
    
    imagePage = imagePage[0] + nextcontent + imagePage[1];
    
    imagePage = imagePage.split("<!-- BACK TO GALLERY -->");
    const backcontent = index === 0
      ? `<a href="../index.html#${pageIndex}" class="button">Back to gallery</a>`
      : `<a href="../${index + 1}.html#${pageIndex}" class="button">Back to gallery</a>`
    ;
    
    imagePage = imagePage[0] + backcontent + imagePage[1];
  

    console.log(`writing page ${pageName}...`);
    fs.writeFileSync(`output/${pageName}`, imagePage);

    fs.copyFileSync(`input/img/${img.img}`, `output/img/${img.img}`);
  });
  
  rows = rows.join("");
  let page = pageTemplate;
  page = page.split("<!-- GALLERY -->");
  page = page[0] + rows + page[1];

  if (chunkedImages.length > 1) {
    let links = [];
    for (let i = 0; i < chunkedImages.length; i++) {
      if (i === index) {
        links.push(`<li class="active">${i + 1}</li>`);
      } else if (i === 0) {
        links.push(`<li><a href="index.html">${i + 1}</a></li>`);
      } else {
        links.push(`<li><a href="${i + 1}.html">${i + 1}</a></li>`);
      }
    }
    
    let prevPage = index===1
      ? "index"
      : `${index}`
    ;
    
    const nav = `<nav class="pagination">
      <ul>
          ${index === 0 ? '' : `<li><a href="${prevPage}.html">&lt; Prev</a></li>`}
        ${links.join("")}
          ${index === chunkedImages.length - 1 ? '' : `<li><a href="${index + 2}.html">Next &gt;</a></li>`}
      </ul>
    </nav>`
    page = page.split("<!-- PAGINATION -->");
    page = page[0] + nav + page[1];
    if (index > 0) {
      fs.writeFileSync(`output/${index + 1}.html`, page);
    } else {
      fs.writeFileSync(`output/index.html`, page);
    }
  } else {
    fs.writeFileSync(`output/index.html`, page);
  }
})

console.log("copying stylesheet...");
fs.copyFileSync("input/style.css", "output/style.css");

let t1 = performance.now();
console.log(`All files generated in ${t1 - t0} ms!`);
