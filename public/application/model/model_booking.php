<?php

class Model_Booking extends Model {
    function __construct()
    {
        parent::db_connect();
    }

    public function getTags(){
        $result = array();
        $query = "SELECT * FROM tag_to_hotel";
        $query_result = parent::db_query($query);
        while ($row = $query_result->fetch_assoc()) {
            $result[$row['hotelid']][] = $row['tag'];
        }
        return $result;
    }

    public function getSortedTags() {
        $result = array();
        $query = "SELECT tag, COUNT(*) cnt FROM tag_to_hotel GROUP BY tag ORDER BY cnt DESC";
        $query_result = parent::db_query($query);
        while ($row = $query_result->fetch_assoc()) {
            $result[] = array(
                'label' => $row['tag']
            );
        }
        return $result;
    }
}