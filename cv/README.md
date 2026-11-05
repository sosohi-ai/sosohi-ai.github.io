# CV Source

This directory contains the LaTeX source for Sohee Park's curriculum vitae. It is based on the [Awesome-CV](https://github.com/posquit0/Awesome-CV) template.

## Build

Run the following command from this directory:

```powershell
latexmk sohee_CV.tex
```

The generated PDF is written to `build/sohee_CV.pdf`. After reviewing the result, copy it to the website asset used by the CV link:

```powershell
Copy-Item build/sohee_CV.pdf ../assets/Sohee_Park_CV.pdf -Force
```

Build artifacts are excluded from Git. The published PDF at `assets/Sohee_Park_CV.pdf` is tracked together with the website.

