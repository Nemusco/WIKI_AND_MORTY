<?php  
	function cleanString( string $string ) : string
	{
		$string = strip_tags($string);
		$string = trim($string);

		return $string;
	}
?>

<?php  
final class RickAndMorty {
	private static $basePath = "https://rickandmortyapi.com/api/";

	public function __construct(){

	}

	public function getAll( string $entity = "character"|"location"|"episode" ) : array
	{
		$entity = cleanString($entity);

		try {
			$results = json_decode(file_get_contents(self::$basePath.$entity),true);
			return $results;
		}
		catch( Exception $e ){
			return [];
		}
	}

	public function getAllWhich( array $properties, string $entity = "character"|"location"|"episode" ) : array
	{
		$entity = cleanString($entity);
		$path = self::$basePath."{$entity}/?";

		//Creo mi query string
		foreach( $properties as $property => $value ){
			$property = cleanString($property);
			$value = cleanString($property);
		}

		$path .= http_build_query($properties);

		try {
			return json_decode(file_get_contents($path),true);
		}
		catch ( Exception $e ){
			return [];
		} 
	}

	public function getOne( int $id, string $entity = "character"|"location"|"episode" ) : array
	{
		$entity = cleanString($entity);
		settype($id,"int");

		$path = self::$basePath."{$entity}/{$id}";

		try {
			return json_decode(file_get_contents($path),true);
		}
		catch( Exception $e ){
			return [];
		}
	}

	public function getPage( string $page ) : array
	{
		$page = cleanString($page);

		try {
			return json_decode(file_get_contents($page),true);
		}
		catch( Exception $e ){
			return [];
		}
	}
}

?>