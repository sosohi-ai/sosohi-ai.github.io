const DATA_ROOT = "data";

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

const applyLinkBehavior = (link, item) => {
  link.href = item.url;
  if (item.external) {
    link.target = "_blank";
    link.rel = "noreferrer";
  }
};

const fetchData = async (name) => {
  const response = await fetch(`${DATA_ROOT}/${name}.json`, { cache: "no-cache" });
  if (!response.ok) throw new Error(`Unable to load ${name}.json (${response.status})`);
  return response.json();
};

const renderNewsPreview = (target, items) => {
  const fragment = document.createDocumentFragment();
  items.slice(0, 3).forEach((item) => {
    const row = createElement("div", "news-item");
    const time = createElement("time", "", item.dateShort || item.dateLabel);
    time.dateTime = item.date;
    const paragraph = createElement("p");
    const link = createElement("a", "news-link", item.previewTitle || item.title);
    link.href = `news.html#${item.id}`;
    paragraph.append(link);
    row.append(time, paragraph);
    fragment.append(row);
  });
  target.replaceChildren(fragment);
};

const renderNewsPage = (target, items) => {
  const fragment = document.createDocumentFragment();
  items.forEach((item) => {
    const article = createElement("article", "news-article");
    article.id = item.id;
    const time = createElement("time", "", item.dateLabel);
    time.dateTime = item.date;
    article.append(time, createElement("h2", "", item.title));
    item.body.forEach((paragraph) => article.append(createElement("p", "", paragraph)));
    if (item.resources?.length) {
      const resources = createElement("div", "resource-row");
      item.resources.forEach((resource) => {
        const link = createElement("a", "", resource.label);
        applyLinkBehavior(link, resource);
        resources.append(link);
      });
      article.append(resources);
    }
    fragment.append(article);
  });
  target.replaceChildren(fragment);
  document.querySelectorAll("main > article.news-article").forEach((node) => node.remove());
};

const renderProjectsPreview = (target, items) => {
  const featured = items
    .filter((item) => item.featured)
    .sort((a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99));
  const fragment = document.createDocumentFragment();
  featured.forEach((item) => {
    const article = createElement("article", "project-summary");
    article.append(createElement("div", "project-meta", `${item.period} · ${item.category}`));
    const heading = createElement("h3");
    const titleLink = createElement("a", "", item.previewTitle || item.title);
    titleLink.href = `projects.html#${item.id}`;
    heading.append(titleLink);
    article.append(heading, createElement("p", "", item.previewSummary || item.summary));
    const detailLink = createElement("a", "project-detail-link", "Project Details →");
    detailLink.href = `projects.html#${item.id}`;
    article.append(detailLink);
    fragment.append(article);
  });
  target.replaceChildren(fragment);
};

const renderProjectsPage = (target, items) => {
  const fragment = document.createDocumentFragment();
  items.forEach((item) => {
    const article = createElement("article", "project-detail");
    article.id = item.id;
    const meta = createElement("aside", "project-detail-meta");
    [item.period, item.role, item.funder, item.grant]
      .filter(Boolean)
      .forEach((value) => meta.append(createElement("p", "", value)));
    const body = createElement("div", "project-detail-body");
    body.append(createElement("h3", "", item.title), createElement("p", "", item.summary));
    article.append(meta, body);
    fragment.append(article);
  });
  target.replaceChildren(fragment);
  document.querySelectorAll("article.project-detail").forEach((node) => {
    if (!target.contains(node)) node.remove();
  });
};

const createPublication = (item, compact = true) => {
  const article = createElement("article", compact ? "publication-item compact" : "publication-item");
  article.id = item.id;

  if (item.thumbnail) {
    const preview = createElement("div", "publication-preview");
    const image = document.createElement("img");
    image.src = item.thumbnail;
    image.alt = item.thumbnailAlt;
    image.width = 320;
    image.height = 430;
    image.loading = "lazy";
    image.decoding = "async";
    preview.append(image);
    article.append(preview);
  } else {
    const badge = createElement("div", "publication-badge");
    badge.append(createElement("span", "", item.badge || "Publication"));
    badge.append(createElement("strong", "", item.year));
    article.append(badge);
  }

  const body = createElement("div", "publication-body");
  const title = createElement("h3");
  title.innerHTML = item.titleHtml;
  const authors = createElement("p", "authors");
  authors.innerHTML = item.authorsHtml;
  const venue = createElement("p", "venue");
  venue.innerHTML = item.venueHtml;
  body.append(title, authors, venue);

  if (item.links?.length) {
    const links = createElement("div", "publication-links");
    item.links.forEach((resource) => {
      const link = createElement("a", "", resource.label);
      applyLinkBehavior(link, resource);
      links.append(link);
    });
    body.append(links);
  }

  article.append(body);
  return article;
};

const renderFeaturedPublications = (target, sections) => {
  const items = sections.flatMap((section) => section.items).filter((item) => item.featured);
  const preferredOrder = ["star-2026", "roco-2026", "trace-2026", "crossmodal-2025"];
  items.sort((a, b) => preferredOrder.indexOf(a.id) - preferredOrder.indexOf(b.id));
  target.replaceChildren(...items.map((item) => createPublication(item, false)));
};

const renderPublicationsPage = (target, sections) => {
  const fragment = document.createDocumentFragment();
  sections.forEach((sectionData, sectionIndex) => {
    const section = createElement("section", "publication-group");
    if (sectionIndex === 0) section.id = "publication-list";
    section.setAttribute("aria-labelledby", sectionData.id);
    const heading = createElement("h2");
    heading.id = sectionData.id;
    heading.innerHTML = sectionData.titleHtml;
    const list = createElement("div", "publication-list");
    sectionData.items.forEach((item) => list.append(createPublication(item, true)));
    section.append(heading, list);
    fragment.append(section);
  });
  target.replaceChildren(fragment);
  document.querySelectorAll("main > section.publication-group").forEach((node) => node.remove());
};

const renderHonors = (target, items) => {
  const fragment = document.createDocumentFragment();
  items.forEach((item) => {
    const article = createElement("article", "honor-item");
    const time = createElement("time", "", item.year);
    time.dateTime = item.year;
    const body = createElement("div");
    body.append(createElement("h3", "", item.title), createElement("p", "", item.description));
    article.append(time, body);
    fragment.append(article);
  });
  target.replaceChildren(fragment);
};

const initializeContent = async () => {
  const jobs = [];

  const newsPreview = document.querySelector('[data-content="news-preview"]');
  const newsPage = document.querySelector('[data-content="news-page"]');
  if (newsPreview || newsPage) {
    jobs.push(fetchData("news").then(({ items }) => {
      if (newsPreview) renderNewsPreview(newsPreview, items);
      if (newsPage) renderNewsPage(newsPage, items);
    }));
  }

  const projectsPreview = document.querySelector('[data-content="projects-preview"]');
  const projectsPage = document.querySelector('[data-content="projects-page"]');
  if (projectsPreview || projectsPage) {
    jobs.push(fetchData("projects").then(({ items }) => {
      if (projectsPreview) renderProjectsPreview(projectsPreview, items);
      if (projectsPage) renderProjectsPage(projectsPage, items);
    }));
  }

  const featuredPublications = document.querySelector('[data-content="publications-featured"]');
  const publicationsPage = document.querySelector('[data-content="publications-page"]');
  if (featuredPublications || publicationsPage) {
    jobs.push(fetchData("publications").then(({ sections }) => {
      if (featuredPublications) renderFeaturedPublications(featuredPublications, sections);
      if (publicationsPage) renderPublicationsPage(publicationsPage, sections);
    }));
  }

  const honors = document.querySelector('[data-content="honors"]');
  if (honors) jobs.push(fetchData("honors").then(({ items }) => renderHonors(honors, items)));

  const results = await Promise.allSettled(jobs);
  results.filter((result) => result.status === "rejected").forEach((result) => console.error(result.reason));
};

initializeContent();
