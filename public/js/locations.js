//Al finalizar la carga del documento
document.addEventListener(
	"DOMContentLoaded",() => {
		document.querySelector("#search").addEventListener("input",searchLocations,false);
		document.querySelector("#search").addEventListener("blur",searchLocations,false);
		document.querySelector("#search").addEventListener("change",searchLocations,false);

		getLocations();
	}, 
	false);


//Esta es la funcion que ejecuta 
function  getLocations(){
	ajax = new Ajax();

	ajax.starting = getting;
	ajax.receiving = getting;
	ajax.ready = serverRequest;
	//Si deseo obtener con Ajax data intentando acceder a una URI debo usar una URI  y no una ruta al archivo
	ajax.request("POST","http://localhost/RICK_AND_MORTY_API/locations","text");
}

//Esta es la funcion que muestra los resultados
function showLocations( results, resultados ){
	
	cleanHTML(resultados);

	results.forEach( item => {
		const { name, type, dimension } = item;

			//creo el contenido
			const col = document.createElement("div");
			col.classList.add("col","mb-2");

			const container = document.createElement("div");
			container.classList.add("container");

			const row = document.createElement("div");
			row.classList.add("row","bg-dark","item");

			const content = document.createElement("div");
			content.classList.add("col-12","p-2","col-md-9","text-white");
			content.innerHTML = `
			<h1 class="h3">${name}</h1>
			<span class="text-success">${type}</span><br><br>
			Dimension: <span class="text-info">${dimension}</span><br>
			`;

			row.appendChild(content);
			container.appendChild(row);
			col.appendChild(container);
			resultados.appendChild(col);
		} );
}

//Esta es la funcion que solicita una pagina especifica
function getPage( elem ){
	const page = elem.target.parentElement.getAttribute("data-page");
	const ajax = new Ajax();

	//Ahora que tengo la pagina que quiere consultar el usuario hago una peticion al servidor
	ajax.starting = getting;
	ajax.receiving = getting;
	ajax.ready = serverRequest;

	let data = new FormData();
	data.append("page",page);

	ajax.request("POST","http://localhost/RICK_AND_MORTY_API/locations","text",data);
}

//Esta es la funcion que se asigna al metodo ready de ajax
function serverRequest( status, message, response ){
	const resultados = document.querySelector("#resultados");
	const paginador = document.querySelector("#paginador");
	const paginador2 = document.querySelector("#paginador2");

	try{
		response = JSON.parse(response);
	}
	catch( e ){
		return;
	}

	const { info, results } = response;

	showLocations(results,resultados);

	//Creando un paginador
	const { pages, next, prev } = info;

	cleanHTML(paginador);
	cleanHTML(paginador2);

	if( pages > 1 ){
		const ul = document.createElement("ul");
		ul.classList.add("pagination","pagination-sm");

		for( let i=1; i <= pages;++i ){
			const li = document.createElement("li");
			li.classList.add("page-item");
			li.dataset.page = ( next ) 
			? next.replace(/\d{1,3}/,i) 
			: ( prev ) ? prev.replace(/\d{1,3}/,i) : null;

			li.style.cursor = "pointer";

			const span = document.createElement("span");
			span.classList.add("page-link");
			span.textContent = i;

			li.onclick = getPage;

			li.appendChild(span);
			ul.appendChild(li);
		}

		paginador.appendChild(ul);

		const ul2 = document.createElement("ul");
		ul2.classList.add("pagination","pagination-sm");

		if( prev ){
			const li = document.createElement("li");
			li.classList.add("page-item");
			li.style.cursor = "pointer";
			li.dataset.page = prev;

			const span = document.createElement("span");
			span.classList.add("page-link");
			span.textContent = "<<Prev";

			li.onclick = getPage;

			li.appendChild(span);
			ul2.appendChild(li);
		}

		if( next ){
			const li = document.createElement("li");
			li.classList.add("page-item");
			li.style.cursor = "pointer";
			li.dataset.page = next;

			const span = document.createElement("span");
			span.classList.add("page-link");
			span.textContent = "Next>>";

			li.onclick = getPage;

			li.appendChild(span);
			ul2.appendChild(li);
		}

		
		paginador2.appendChild(ul2);
	}
}

function cleanHTML( contenedor ){
	while( contenedor.firstElementChild ) contenedor.removeChild(contenedor.firstElementChild);
}

function getting(){
	const resultados = document.querySelector("#resultados");

	//Dando forma a un spinner
	const col = document.createElement("div");
	col.classList.add("col-12","col-md-4");

	const atom = document.createElement("div");
	atom.classList.add("atom-spinner");

	const inner = document.createElement("div");
	inner.classList.add("spinner-inner");

	for( let i=1; i <= 3; ++i ){
		const line = document.createElement("div");
		line.classList.add("spinner-line");
		inner.appendChild(line);
	}

	const circle = document.createElement("div");
	circle.classList.add("spinner-circle");
	circle.innerHTML = "&#9679;";

	inner.appendChild(circle);
	atom.appendChild(inner);
	col.appendChild(atom);
	resultados.appendChild(col);
}

function searchLocations( elem ){
	const { value } = elem.target;

	if( value.length > 0 ){
		const ajax = new Ajax();
		const data = new FormData();

		data.append("search",value);

		ajax.ready = serverRequest;
		ajax.request("POST","http://localhost/RICK_AND_MORTY_API/locations","text",data);
		return;
	}

	getLocations();
}