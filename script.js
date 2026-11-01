"use strict";

document.documentElement.classList.add("js");

const menuButton = document.querySelector(".menu-toggle");
const menuLabel = document.querySelector(".menu-label");
const navigation = document.querySelector(".site-nav");

function closeMenu(returnFocus = false) {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
  if (menuLabel) menuLabel.textContent = "Menu";
  if (returnFocus) menuButton.focus();
}

if (menuButton && navigation) {
  menuButton.hidden = false;
  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    navigation.classList.toggle("is-open", !expanded);
    if (menuLabel) menuLabel.textContent = expanded ? "Menu" : "Fermer";
  });
  navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => closeMenu());
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu(true);
    }
  });
  document.addEventListener("click", event => {
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  const desktopQuery = window.matchMedia("(min-width: 701px)");
  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener("change", event => {
      if (event.matches) closeMenu();
    });
  }
}

const filterGroup = document.querySelector(".filters");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const projects = [...document.querySelectorAll(".project[data-category]")];
const galleryCount = document.querySelector(".gallery-count");

if (filterGroup && projects.length) {
  filterGroup.hidden = false;
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      let visible = 0;
      projects.forEach(project => {
        const matches = category === "all" || project.dataset.category === category;
        project.hidden = !matches;
        if (matches) visible += 1;
      });
      filterButtons.forEach(filter => {
        const selected = filter === button;
        filter.setAttribute("aria-pressed", String(selected));
        filter.classList.toggle("is-active", selected);
      });
      if (galleryCount) galleryCount.textContent = `${visible} réalisation${visible > 1 ? "s" : ""}`;
    });
  });
}

const viewer = document.getElementById("project-viewer");
const viewerImage = document.getElementById("viewer-image");
const viewerTitle = document.getElementById("viewer-title");
const viewerDescription = document.getElementById("viewer-description");
const viewerCategory = document.getElementById("viewer-category");
const viewerSpecs = document.getElementById("viewer-specs");
let viewerOpener = null;

if (viewer && typeof viewer.showModal === "function") {
  document.querySelectorAll("[data-lightbox]").forEach(link => {
    link.addEventListener("click", event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const project = link.dataset.projectId
        ? document.getElementById(link.dataset.projectId)
        : link.closest(".project");
      if (!project) return;
      const sourceImage = project.querySelector("img");
      const title = project.querySelector(".project-title");
      const description = project.querySelector(".project-description");
      const specs = project.querySelector(".project-specs");
      const category = project.querySelector(".project-category");
      if (!sourceImage || !title || !description) return;
      event.preventDefault();
      viewerOpener = link;
      viewerImage.src = sourceImage.getAttribute("src");
      viewerImage.alt = sourceImage.alt;
      viewerImage.width = sourceImage.width;
      viewerImage.height = sourceImage.height;
      viewerTitle.textContent = title.textContent;
      viewerDescription.textContent = description.textContent;
      viewerSpecs.textContent = specs ? specs.textContent : "";
      viewerCategory.textContent = category ? category.childNodes[0].textContent.trim() : "Ma réalisation";
      viewer.showModal();
      document.body.classList.add("viewer-open");
    });
  });
  viewer.querySelector(".viewer-close").addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", event => {
    if (event.target !== viewer) return;
    const bounds = viewer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
  });
  viewer.addEventListener("close", () => {
    document.body.classList.remove("viewer-open");
    if (viewerOpener && viewerOpener.isConnected) viewerOpener.focus({ preventScroll: true });
  });
}
