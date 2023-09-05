# Static accessible gallery generator

This is a fork of J Sanderson's gallery generator. It produces a static accessible image gallery by making pages for each image with the image description on it, then chucking all the images into a main gallery view with alt text. There are some other accessibility features as well. Hooray!

Everything you need to mess with is in the input folder. You can also change the number of images per page by editing this line in the gen.js file. There are 10 images per page by default.

``` const imagesToPage = 10; ```

## Adding images

Populate input/images.json with the required files. There are already some in there for you to look at. Each object takes the following keys:

- "img" - image filename. Do not add the path, the generator knows where to find it. Mandatory.
- "alt" - alt text for your image. Mandatory.
- "desc" - long description for your image. Mandatory.
- "comment" - comments/blurb about the image. Optional.

## Template editing

Templates are in the input folder.

- template-index.html is the template for the gallery view. &lt;!-- PAGINATION --&gt; and &lt;!-- GALLERY --&gt; tell the script where to put the pagination and images, so don't delete them!
- template-page.html is the template for individual image pages. &lt;!-- IMAGE --&gt; is where the image and its data will go (no need to enclose in its own container).  &lt;!-- PREVIOUS --&gt;, &lt;!-- NEXT --&gt;, and &lt;!-- BACK TO GALLERY --&gt; are where the navigation links will go. Don't remove those!

This will also work with SSI (server side includes), provided you have it enabled for HTML files. 

A basic stylesheet is provided (input/style.css). If you want to integrate with your current stylesheet, the file style-for-pasting.css contains all the classes and variables that get used in the template. 

## Generating the gallery

Install [Node.js](https://nodejs.org/en). Run node gen.js. Fix errors if necessary. Repeat until the script finishes. Move everything in the output folder to the correct folder on your website. Win!