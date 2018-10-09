<?php

class Model
{
	protected static $DataBase;
	public $result;

	public function db_connect()
	{
		include_once __DIR__.'/config.php';
		self::$DataBase = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
		self::$DataBase -> set_charset(DB_CHARSET);
		if (mysqli_connect_errno()) {
   			printf("Cannot connect to database: %s\n", mysqli_connect_error());
   			exit;
		}
	}

	public function db_query($query)
	{
		$result = self::$DataBase->query($query);
		return $result;
	}

	public function db_close()
	{
		self::$DataBase->close();
	}
}
?>