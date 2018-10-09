<?php

/**
 * Class Controller_Tags
 * class for getting additional info
 * about tags connections
 */
class Controller_Tags extends Controller {
    protected $params;
    protected $model;


    function __construct(){
        $this->model = new Model_Tags();
        $this->params = $_REQUEST;
    }

    function action_getConnectedTags(){
        if(!isset($this->params['tag'])){
            $result = array(
                'status' => 'error',
                'message' => 'Not enough parameters! Parameter "tag" is needed!'
            );
            return json_encode($result);
        }

        $connectedTags = $this->model->getConnectedTags($this->params['tag']);
        if($connectedTags !== false){
            $result = array(
                'status' => 'ok',
                'result' => json_decode(json_encode($connectedTags)),
            );
            return json_encode($result);
        }
    }

}