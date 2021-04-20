<?php
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Factory\AppFactory as Slim;

$slim = Slim::create();
	//$slim->setBasePath("/RICK_AND_MORTY_API"); //Esto es cuando ejecuto la app desde localhost

	require_once("Classes/RickAndMorty.php");

	//Esto sera la vista de cada URI
	$slim->get("/", function ( Request $request, Response $response ) {
		$response->getBody()->write(file_get_contents("public/home.html"));
		return $response;
	});

	$slim->get("/characters", function ( Request $request, Response $response ){
		$response->getBody()->write(file_get_contents("public/characters.html"));
		return $response;
	});

	$slim->get("/episodes",function ( Request $request, Response $response ) {
		$response->getBody()->write(file_get_contents("public/episodes.html"));
		return $response;
	});

	$slim->get("/locations",function ( Request $request, Response $response ){
		$response->getBody()->write(file_get_contents("public/locations.html"));
		return $response;
	});

	
	//Por medio de Ajax accedere para consumir la data que extraigo de la API
	$slim->post("/characters", function ( Request $request, Response $response ){
		$rmInstance = new RickAndMorty();

		$response->withHeader("Content-Type","application/json");

		if( isset($_POST["page"]) ) $response->getBody()->write(json_encode($rmInstance->getPage($_POST["page"])));

		else if( isset($_POST["search"]) ){
			$data = array( "name" => $_POST["search"] );
			$response->getBody()->write(json_encode($rmInstance->getAllWhich($data,"character")));
		}
		
		else $response->getBody()->write(json_encode($rmInstance->getAll("character")));
		
		return $response;
	});
	
	$slim->post("/locations", function ( Request $request, Response $response ){
		$rmInstance = new RickAndMorty();

		$response->withHeader("Content-Type","application/json");

		if( isset($_POST["page"]) ) $response->getBody()->write(json_encode($rmInstance->getPage($_POST["page"])));

		else if( isset($_POST["search"]) ){
			$data = array( "name" => $_POST["search"] );
			$response->getBody()->write(json_encode($rmInstance->getAllWhich($data,"location")));
		}
		
		else $response->getBody()->write(json_encode($rmInstance->getAll("location")));

		return $response;
	});

	$slim->post("/episodes", function ( Request $request, Response $response ){
		$rmInstance = new RickAndMorty();

		$response->withHeader("Content-Type","application/json");

		if( isset($_POST["page"]) ) $response->getBody()->write(json_encode($rmInstance->getPage($_POST["page"])));

		else if( isset($_POST["search"]) ){
			$data = array( "name" => $_POST["search"] );
			$response->getBody()->write(json_encode($rmInstance->getAllWhich($data,"episode")));
		}
		
		else $response->getBody()->write(json_encode($rmInstance->getAll("episode")));

		return $response;
	});



	$slim->addErrorMiddleware(false,true,false);
	$slim->run();
	?>