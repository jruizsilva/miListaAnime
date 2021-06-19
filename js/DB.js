import { mostrarAlerta } from "./UI/mostrarAlerta.js";

const d = document;
export let animes = [];
let db = null;
let $tbody = null;

const limpiarHTML = () => {
	while ($tbody.firstChild) {
		$tbody.removeChild($tbody.firstChild);
	}
};

export const obtenerAnimesDB = () => {
	const tx = db.transaction("animes");
	const objectStoreAnimes = tx.objectStore("animes");
	const $fragment = d.createDocumentFragment();
	const $template = d.getElementById("templateRow").content;
	const request = objectStoreAnimes.openCursor();
	request.addEventListener("success", () => {
		const cursor = request.result;
		if (cursor) {
			const { value: anime } = cursor;
			animes = [...animes, anime];
			const { title, image_url, url, mal_id, synopsis, airing } = anime;
			if (airing) {
				$template.querySelector(
					".anime__title"
				).textContent = `${title} - En emision`;
			} else {
				$template.querySelector(
					".anime__title"
				).textContent = `${title} - Finalizado`;
			}
			$template.querySelector(".anime__title").setAttribute("href", url);
			$template
				.querySelector(".anime__title")
				.setAttribute("data-airing", airing);
			$template.querySelector(".anime__description").textContent =
				synopsis;
			$template.querySelector(".anime__img").src = image_url;
			$template.querySelector(".anime__delete").dataset.id = mal_id;
			const $clone = $template.cloneNode(true);
			$fragment.appendChild($clone);
			cursor.continue();
		}
	});
	tx.addEventListener("complete", () => {
		limpiarHTML();
		$tbody.appendChild($fragment);
	});
};
export const agregarAnimeDB = (anime) => {
	const tx = db.transaction("animes", "readwrite");
	const objectStoreAnimes = tx.objectStore("animes");
	const request = objectStoreAnimes.add(anime);
	request.addEventListener("success", () =>
		mostrarAlerta("Agregado correctamente", "correcto")
	);
	request.addEventListener("error", () =>
		mostrarAlerta("Ya esta agregado", "error")
	);
};
export const removerAnimeDB = (mal_id) => {
	const tx = db.transaction("animes", "readwrite");
	const objectStoreAnimes = tx.objectStore("animes");
	const request = objectStoreAnimes.delete(mal_id);
	request.addEventListener("success", () =>
		mostrarAlerta("Eliminado correctamente", "error")
	);
	tx.addEventListener("complete", () => {
		$tbody = d.getElementById("tbody");
		if (!$tbody) return;
		obtenerAnimesDB();
	});
};
export const crearDB = () => {
	const request = window.indexedDB.open("Anime", 1);
	request.addEventListener("success", () => {
		db = request.result;
		$tbody = d.getElementById("tbody");
		if (!$tbody) return;
		obtenerAnimesDB();
	});
	request.addEventListener("upgradeneeded", () => {
		db = request.result;

		const objectStoreAnimes = db.createObjectStore("animes", {
			keyPath: "mal_id",
		});
		objectStoreAnimes.createIndex("title", "title", { unique: false });
	});
};
