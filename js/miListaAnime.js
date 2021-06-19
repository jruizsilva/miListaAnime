import { crearDB, removerAnimeDB } from "./DB.js";

const d = document;

d.addEventListener("click", (e) => {
	if (e.target.classList.contains("anime__delete")) {
		const result = confirm("Eliminar anime?");
		if (result) {
			const animeID = Number(e.target.dataset.id);
			removerAnimeDB(animeID);
		}
	}
});

d.addEventListener("DOMContentLoaded", crearDB);
