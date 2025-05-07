This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
ml-model
├─ .hintrc
├─ backend
│  ├─ database
│  │  ├─ mongo.py
│  │  └─ __pycache__
│  │     ├─ database.cpython-312.pyc
│  │     ├─ mongo.cpython-312.pyc
│  │     └─ __init__.cpython-312.pyc
│  ├─ main.py
│  ├─ models
│  │  ├─ all.py
│  │  ├─ k_means.py
│  │  ├─ linear_regression.py
│  │  ├─ random_forest.py
│  │  ├─ svm.py
│  │  └─ __pycache__
│  │     ├─ all.cpython-312.pyc
│  │     ├─ k_means.cpython-312.pyc
│  │     ├─ linear_regression.cpython-312.pyc
│  │     ├─ random_forest.cpython-312.pyc
│  │     └─ svm.cpython-312.pyc
│  ├─ preprocessing
│  │  ├─ preprocessor.py
│  │  └─ __pycache__
│  │     ├─ preprocessor.cpython-312.pyc
│  │     └─ __init__.cpython-312.pyc
│  ├─ routes
│  │  ├─ download_model.py
│  │  ├─ get_dataset.py
│  │  ├─ get_features.py
│  │  ├─ select_features.py
│  │  ├─ train_models.py
│  │  ├─ upload_dataset.py
│  │  └─ __pycache__
│  │     ├─ auto_select_features.cpython-312.pyc
│  │     ├─ dataset.cpython-312.pyc
│  │     ├─ download_model.cpython-312.pyc
│  │     ├─ get_dataset.cpython-312.pyc
│  │     ├─ get_features.cpython-312.pyc
│  │     ├─ get_processed_data.cpython-312.pyc
│  │     ├─ select_features.cpython-312.pyc
│  │     ├─ train_models.cpython-312.pyc
│  │     ├─ upload.cpython-312.pyc
│  │     ├─ upload_dataset.cpython-312.pyc
│  │     └─ __init__.cpython-312.pyc
│  ├─ utils
│  │  ├─ clean_nan_inf.py
│  │  ├─ save_model.py
│  │  └─ __pycache__
│  │     ├─ clean_nan_inf.cpython-312.pyc
│  │     ├─ save_model.cpython-312.pyc
│  │     └─ __init__.cpython-312.pyc
│  └─ __pycache__
│     └─ main.cpython-312.pyc
├─ components.json
├─ eslint.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ favicon.ico
│  │  ├─ features-selection
│  │  │  └─ page.tsx
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ preview-dataset
│  │  │  └─ page.tsx
│  │  ├─ training
│  │  │  └─ page.tsx
│  │  └─ upload-dataset
│  │     └─ page.tsx
│  ├─ components
│  │  ├─ app-features.tsx
│  │  ├─ features-selection.tsx
│  │  ├─ get-started-button.tsx
│  │  ├─ navbar.tsx
│  │  ├─ preview-dataset.tsx
│  │  ├─ sidebar.tsx
│  │  ├─ training.tsx
│  │  ├─ ui
│  │  │  ├─ alert.tsx
│  │  │  ├─ badge.tsx
│  │  │  ├─ button.tsx
│  │  │  ├─ card.tsx
│  │  │  ├─ checkbox.tsx
│  │  │  ├─ data-table.tsx
│  │  │  ├─ input.tsx
│  │  │  ├─ label.tsx
│  │  │  ├─ pagination.tsx
│  │  │  ├─ progress.tsx
│  │  │  ├─ radio-group.tsx
│  │  │  ├─ select.tsx
│  │  │  ├─ separator.tsx
│  │  │  ├─ sheet.tsx
│  │  │  ├─ skeleton.tsx
│  │  │  ├─ slider.tsx
│  │  │  ├─ switch.tsx
│  │  │  ├─ table.tsx
│  │  │  ├─ tabs.tsx
│  │  │  └─ tooltip.tsx
│  │  └─ upload-dataset.tsx
│  ├─ hooks
│  │  └─ use-mobile.ts
│  ├─ lib
│  │  └─ utils.ts
│  └─ styles
│     └─ globals.css
├─ tailwind.config.js
└─ tsconfig.json

```