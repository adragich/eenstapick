<?php

/**
 * Class Route
 * Main routing of project
 */
class Route
{
	static function start()
	{

		$controller_name = 'Main';
		$action_name = 'index';
		
		$routes = explode('/', $_SERVER['REQUEST_URI']);

		if ( !empty($routes[1]) )
		{	
			$controller_name = $routes[1];
		}
		
		if ( !empty($routes[2]) )
		{
			$action_name = $routes[2];
		}

        $model_name = 'Model_'.$controller_name;
        $controller_name = 'Controller_'.$controller_name;
        $action_name = 'action_'.$action_name;

        $model_file = strtolower($model_name).'.php';
        $model_path = "application/model/".$model_file;

        if(file_exists($model_path))
		{
			include "application/model/".$model_file;
        }
		$controller_file = strtolower($controller_name).'.php';
		$controller_path = "application/controller/".$controller_file;
		if(file_exists($controller_path))
		{
			include "application/controller/".$controller_file;
		}
		else
		{
            $res = array(
                'status' => 'error',
                'message' => 'The method you requested does not exist',
            );
            echo json_encode($res);
		}

        $controller = new $controller_name;
        $action = $action_name;

		if(method_exists($controller, $action))
		{
			$res = $controller->$action();
			echo $res;
		}
		else
		{
		    $res = array(
		        'status' => 'error',
                'message' => 'The method you requested does not exist',
            );
			echo json_encode($res);
		}
	}

}
?>