# nextjs-commercejs-example

This repo contains all of the code necessary to create a static commerce with Next.js and Commerce.js. It includes creating index pages for products and categories, single product and category pages, and categories with associated products.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/notrab/nextjs-commercejs-example)

[![Codesandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/notrab/nextjs-commercejs-example/tree/main)

## Run this locally

1. `npm install`
2. Add your `NEXT_PUBLIC_CHEC_PUBLIC_API_KEY` to `.env`
3. `npm run dev`

## Build it with me

Before you start, you'll want to create an account at [Chec](https://commercejs.com) or use the [CLI](https://github.com/chec/cli).

You'll also need to create a few categories, that have products to get the most out of this tutorial. Once you've done that, grab a copy of your public API key. You can find this at [Chec Dashboard > Developer Settings](https://dashboard.chec.io/settings/developer).

_If you don't want to create an account with Commerce.js to follow along with this tutorial, you can use the demo store public key `pk_184625ed86f36703d7d233bcf6d519a4f9398f20048ec`._

### 1. Initial setup

In this tutorial we will be using Next.js. To begin, inside a new directory, do the following:

```bash
npm init -y
npm install react react-dom next @chec/commerce.js
```

Open `package.json` and add the following `scripts`:

```js
"scripts": {
  "dev": "next",
  "build": "next build",
  "start": "next start"
}
```

Now create a new file `.env` and add your public API key here.

```
NEXT_PUBLIC_CHEC_PUBLIC_API_KEY=...
```

### 2. Create a Commerce.js instance

With our initial Next.js setup created, and our `@chec/commerce.js` dependency installed, we'll now instantiate a new commerce instance, and make it available to import throughout the rest of our Next.js project.

Inside a new directory `lib`, create the file `commerce.js`. Inside here we'll export a new instance of `@chec/commerce.js`, following the [Commerce.js Docs](https://commercejs.com/docs/api/#authentication).

```js
// lib/commerce.js
import CommerceSDK from "@chec/commerce.js";

const client = new CommerceSDK(process.env.NEXT_PUBLIC_CHEC_PUBLIC_API_KEY);

export default client;
```

### 3. Create homepage of categories and products

Inside of the `pages` directory, we'll create the `index.js` file to show all our products.

While we're at it, we'll also show and link to all our categories, products, as well merchant information.

For now, let's simply show all of the information we get back from Commerce.js on our page, so we can see what we need to refactor.

Inside `pages/index.js`, add the following:

```js
// pages/index.js
import commerce from "../lib/commerce";

export async function getStaticProps() {
  const merchant = await commerce.merchants.about();
  const { data: categories } = await commerce.categories.list();
  const { data: products } = await commerce.products.list();

  return {
    props: {
      merchant,
      categories,
      products,
    },
  };
}
```

Here we are making use of the Next.js `getStaticProps` lifecylce method during build. This tells Next.js to source our content once, and return them as "static" props.

Then inside `pages/index.js`, let's export a default function that is our page component.

```js
// pages/index.js
export default function IndexPage({ merchant, categories, products }) {
  return (
    <React.Fragment>
      <pre>{JSON.stringify(merchant, null, 2)}</pre>
      <pre>{JSON.stringify(categories, null, 2)}</pre>
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </React.Fragment>
  );
}
```

### 4. Create `ProductList` & `Product` components

As we want to show our products in multiple places throughout this example, we should think about creating reusable React components to save us on duplicating our code.

Inside a new directory called `components`, create the file `Product.js`.

Inside here we'll export a new function, that returns the `name` and `price.formatted_with_symbol` of our products.

```js
// components/Product.js
export default function Product({ name, price }) {
  return (
    <p>
      {name}: {price.formatted_with_symbol}
    </p>
  );
}
```

Since this component only handles rendering one product, we also need to create a component that will renderer each of our `Product` components per product returned from Commerce.js.

Inside a new file `ProductList.js` in the `components` directory, add the following:

```js
// components/ProductList.js
import Link from "next/link";

import Product from "./Product";

export default function ProductList({ products }) {
  if (!products) return null;

  return (
    <ul>
      {products.map((product) => (
        <li key={product.permalink}>
          <Link href={`/products/${product.permalink}`}>
            <a>
              <Product {...product} />
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

In this file we're doing a few things, so let's break it down:

1. Importing the `Link` component from Next.js
2. Importing the `Product` component we just created
3. Checking if the prop `products` contains anything, if not, don't do anything
4. Mapping over each of our `products` and invoking the `Link` component with `Product` as our child - where we spread in our `product` values (such as name/price) we need inside that component

### 5. Update index page to use `ProductList` component

Let's now put the `ProductList` component to work! Inside `pages/index.js`, let's add a new import right after the commerce.js client.

```js
import ProductList from "../components/ProductList";
```

Now inside the `IndexPage` function we can simplify replace:

```js
<pre>{JSON.stringify(products, null, 2)}</pre>
```

With our new `ProductList` component:

```js
<ProductList products={products} />
```

### 6. Create products index page

Since our index page contains the links to all our categories, products, and merchant information, we should create a page just for showing products.

Create a new file `products.js` inside `pages` directory, and add the following:

```js
// pages/products.js
import commerce from "../lib/commerce";
import ProductList from "../components/ProductList";

export async function getStaticProps() {
  const { data: products } = await commerce.products.list();

  return {
    props: {
      products,
    },
  };
}

export default function ProductsPage({ products }) {
  return (
    <React.Fragment>
      <h1>Products</h1>

      <ProductList products={products} />
    </React.Fragment>
  );
}
```

In here we're importing the same components we used on the homepage but this time only requesting our products.

The benefit of creating the `ProductList` component once is that we can reuse it wherever we like, as long as we pass it the `products` prop, it'll work just fine.

### 7. Create `CategoryList` & `Category` components

In the same way we created the `ProductList` and `Product` components, we'll do the same for our categories.

Inside a new file `Category.js` inside the `components` directory, add the following:

```js
// components/Category.js
export default function Category({ name }) {
  return name;
}
```

We're not doing too much in this file but return the `name` of our category.

Next create the file `CategoryList.js` inside the `components` directory, and add the following:

```js
// components/CategoryList.js
import Link from "next/link";

import Category from "./Category";

export default function CategoryList({ categories }) {
  if (!categories) return null;

  return (
    <ul>
      {categories.map((category) => (
        <li key={category.slug}>
          <Link href={`/categories/${category.slug}`}>
            <a>
              <Category {...category} />
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

The only real difference here is that we returned a list of links that go to `/categories/:slug` instead of `/products/:permalink`.

### 8. Create categories index page

Let's also do the same for categories. In a new file `categories.js` inside the `pages` directory, add the following:

```js
// pages/categories.js
import commerce from "../lib/commerce";
import CategoryList from "../components/CategoryList";

export async function getStaticProps() {
  const { data: categories } = await commerce.categories.list();

  return {
    props: {
      categories,
    },
  };
}

export default function CategoriesPage({ categories }) {
  return (
    <React.Fragment>
      <h1>Categories</h1>

      <CategoryList categories={categories} />
    </React.Fragment>
  );
}
```

As we did in the products index page, we're simply requesting all of our categories from Commerce.js and passing them onto the `CategoryList` component.

### 9. Update index page to use CategoryList component

Now we have the `CategoryList` component, let's go ahead and tidy up the index page by adding this there also.

At the top of the `pages/index.js` file go ahead and import our new `CategoryList`.

```js
import CategoryList from "../components/CategoryList";
```

Then where we have:

```js
<pre>{JSON.stringify(categories, null, 2)}</pre>
```

Replace it with:

```js
<CategoryList categories={categories} />
```

While we're at it, let's also add some headings for our categories, and products with links to the pages we just created. We'll also add an `h1` to the page that just shows our merchant `business_name`.

Also add the following import at the top of the `pages/index.js` file:

```js
import Link from "next/link";
```

Now update the `IndexPage` function to look a little something like:

```js
// pages/index.js
export default function IndexPage({ merchant, categories, products }) {
  return (
    <React.Fragment>
      <h1>{merchant.business_name}</h1>

      <h3>
        <Link href="/categories">
          <a>Categories</a>
        </Link>
      </h3>

      <CategoryList categories={categories} />

      <h3>
        <Link href="/products">
          <a>Products</a>
        </Link>
      </h3>

      <ProductList products={products} />
    </React.Fragment>
  );
}
```

### 10. Create individual category page

Since we're linking to the individual categories inside our `CategoryList` component, let's go ahead and create the pages at the path `/categories/:slug`.

We can use Next.js to create all of our category pages at build time, and without having to create individual pages for each one too!

To do this, create a directory caled `categories` inside the current `pages` directory. Now create a new file `[slug].js` - including the square brackets.

This tells Next.js we want to use `slug` as a param to our page component.

Inside `pages/categories/[slug].js` we will use the same `getStaticProps` method to fetch and provide static props to our page. We'll `retrieve` an existing category from Commerce.js, and while we're at it, we'll get all of the products belonging to that category.

To do this, we can provide the current `slug` given to use by the current page path, to Commerce.js so we [filter](https://commercejs.com/docs/api/#list-all-products) [accordingly](https://commercejs.com/docs/api/#retrieve-category).

```js
// pages/categories/[slug].js
import commerce from "../../lib/commerce";
import ProductList from "../../components/ProductList";

export async function getStaticProps({ params }) {
  const { slug } = params;

  const category = await commerce.categories.retrieve(slug, {
    type: "slug",
  });

  const { data: products } = await commerce.products.list({
    category_slug: slug,
  });

  return {
    props: {
      category,
      products,
    },
  };
}
```

Now we have the API hooked up for getting data for each of our pages, we still don't have any pages.

Below the `getStaticProps` export, export a new function `getStaticPaths`.

This function must return a `paths` array that is the paths to our pages. We must provide that all important `slug` param.

```js
// pages/categories/[slug].js
export async function getStaticPaths() {
  const { data: categories } = await commerce.categories.list();

  return {
    paths: categories.map((category) => ({
      params: {
        slug: category.slug,
      },
    })),
    fallback: false,
  };
}
```

All that's left to do is export as the default our actual category page component.

```js
// pages/categories/[slug].js
export default function CategoryPage({ category, products }) {
  return (
    <React.Fragment>
      <h1>{category.name}</h1>

      <ProductList products={products} />
    </React.Fragment>
  );
}
```

### 11. Create product page

In the same way we created our category pages, and fetched the data, we can do it for products.

Inside of a new directory `products` inside `pages`, create the file `[permalink].js`. We're using `permalink` here as that's what Commerce.js gives us for each of our products.

The contents of this file should be familiar:

```js
// pages/products/[permalink].js
import commerce from "../../lib/commerce";

export async function getStaticProps({ params }) {
  const { permalink } = params;

  const product = await commerce.products.retrieve(permalink, {
    type: "permalink",
  });

  return {
    props: {
      product,
    },
  };
}

export async function getStaticPaths() {
  const { data: products } = await commerce.products.list();

  return {
    paths: products.map((product) => ({
      params: {
        permalink: product.permalink,
      },
    })),
    fallback: false,
  };
}

export default function ProductPage({ product }) {
  return (
    <React.Fragment>
      <h1>{product.name}</h1>
      <p>{product.price.formatted_with_symbol}</p>
    </React.Fragment>
  );
}
```

### 12. Run it locally

That's it!

Now you're ready to go! Type `npm run dev` in your Terminal, and head to the local port to browse your Next.js powered commerce site.
