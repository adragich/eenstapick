<?php

class Model_Tags extends Model {
    function __construct()
    {
        parent::db_connect();
    }

    public function getConnectedTags($tag = ''){
        if(empty($tag)){
            return false;
        }
        $result = array();
        $query = "SELECT secondary_tag FROM connected_tags WHERE primary_tag = '{$tag}'";
        $query_result = parent::db_query($query);
        while ($row = $query_result->fetch_assoc()) {
            $result[] = array(
                'label' => $row['secondary_tag']
            );
        }
        return $result;
    }
}