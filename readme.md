SiteCraft
===================

Another dinamic to static page generator (like Hugo but by me)

## What is SiteCraft?
Sitecraft helps you to create simple static pages with minimal configuration
centered in easy to use and mantain.
To create your site you just need to edit the `homepage.md` file with your needs.

SiteCraft was created to be able to create static pages easily with an opion of creating a blog. So you are not obligated to use any blog style structure unless you want it.

SiteCraft can help you to create a simple static landing page for any needs with a record low price of only-the-cost-of-your-domain, no hosting payments needed if deployed to githubpages.

SiteCraft was made to be able to deploy to github pages, but in reality you can
serve the `/public` directory to any static server (nginx, apache, python, etc).

## How to use
Just install it with `npm i -D sitecraft` and then just use

```bash
npx sitecraft
```
to build `/public` directory

or 
```bash
npx sitecraft serve
```
to launch a development server. THIS SERVER IS MEANT FOR DEVELOPMENT, only use it while doing changes to your site so you can see them in real time.

## Structure
```
─ yoursite
  ├─ content
  |  ├─ posts
  |  |  └─ your-blog-post.md
  |  ├─ homepage.md
  |  └─ any-other-page.md
  └─ template
  |  ├─ favicon
  |  |  └─ # all your favicon related files
  |  ├─ images
  |  |  └─ # all your images
  |  ├─ partials
  |  |  └─ # all partials needed for the template and SiteCraft
  |  ├─ page.pug
  |  ├─ post.pug
  |  └─ styles.styl
  ├─ public
  |  └─ # This directory is created with your final site
  └─ site.yml # all your site configurations
```
Normally you wont need to edit anything inside `template` and you can just import it from the gallery (comming soon).

For a regular site, you just need to update the styles.styl with your needs about site colors and fine adjustments. Also all stylus imports are going to be look for inside `partials` as root inside stylus.

## Site definitions
All site definitions should be place inside a `site.yml` at the root of your site. Here is an example:
```yaml
siteName: My awesome site
siteDesc: This is my awesome site, come take a look
author:
  name: Myself
  site: my-personal-site buy me a coffe
siteUrl: https://mysite.com
cname: mysite.com
pages:  # this node is optional
  Home: /
  Blog: /blog
```
- siteName: used to populate `<title>` in your website.
- siteDesc: same, used to populate the site description at your site metadata
- author: this is added as a comment in the HTML as a small fingerprint
- siteUrl: This is used to populate the site metadata
- cname: This will create a CNAME file at the root of your deployment, this is required for githubpages so you can use a custom url. Remember `cname` must not contain protocol, only the domain
- pages: this is an optional node, if you add it, it will habilitate the shorthand pages to be used in the templates and display all pages described there.

## Create your site
the only required md file is `homepage.md` which must be located inside `content`. This file will be translated as index.html inside `public` when built.
There you can use md or html to create your homepage.
Remember that header and footer are defined in `template`.

### Want more pages?
Just create another `.md` file inside content, this file will be transposed to the root of your site using the file name as the url.

### Want a blog?
Just put inside `/posts` your entries as `.md` files. Just as with pages, the file name will be transposed as the slug for your post.
- Currently all blog posts are being deployed to `yoursite/posts/your-blog-post`

### Blog metadata
All entries (pages and blog posts) are expecting a meta definition at the very begining of the file just like this:

```markdown
meta:
  title: My post title
  date: 20230609
  author: Zero

# Here is my post title
## H2 title

Here is my post in markdown
```

meta is formatted as `yaml` and it should have:
- title: the title of your post to render in the post list and navigation
- date: consider using `YYYYMMDD` or `YYYYMMDDHHMM` if you are planning to post more than one post per day. SiteCraft will automatically order them using this value
- author: you <3

This metadata is required for all blog posts, but not for pages. If you don't want to add any metadata to page just skip two lines and start your content at the 3rd line. (might think in something clever later, but for now, that works just fine)

## Shorthands and variables
All variables defined in `site.yml` can be accesed at the `pug` files and can be used at a glance.
Meanwhile, from inside the `.md` files, you cannot acces this variables, so ther are a couple of shorthands that you can use to improve your site.
- !{blogList} will render a HTML with the list of all the blog entries. No pagination available by now
- !{siteName} will render your site name as defined in `site.yml`
- !{siteDesc} will render your site description as defined in `site.yml`

More shorthands will come as needed

## Deploying
Sitecraft creates (using `npx sitecraft`) a /public directory wich can be served using nginx, apache or any simple http server.
To deploy to github pages, you will need an action like this: 

```yaml
name: GitHub Pages

on:
  workflow_dispatch:
    inputs:

jobs:
  deploy:
    runs-on: ubuntu-22.04
    permissions:
      contents: write
    concurrency:
      group: ${{ github.workflow }}-${{ github.ref }}
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - run: npm ci
      - run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```
(remember to put this action as gh-pages.yml inside /.github/workflows/)

note that this action will look for `./public` and will deploy that to the root of a new branch called gh-pages. Then just activate the gh-pages page for that repository