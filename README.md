# Subtitle editor

A simple browser-based subtitle editor with no server component.

This is a remake of [this project](https://github.com/spun/angularjs-subApp), now rebuilt using React Router instead of AngularJS.

## How to run

### Using npm

Install dependencies:

```bash
npm install
```

Build the web app:

```bash
npm run build
```

Start the development server:

```bash
npm run dev
```

---

### Using Docker

Build the image:

```bash
docker build -t react-subtitle-editor:1.0 . 
```

Run the container:

```bash
docker run --rm -d -p 8080:8080 localhost/react-subtitle-editor:1.0
```