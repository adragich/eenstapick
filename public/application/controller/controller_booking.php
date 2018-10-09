<?php

/**
 * Class Controller_Booking
 * class for getting information about hotels
 * using Booking API
 * additional filtering by tags
 */
class Controller_Booking extends Controller {
    protected $login = 'womenintech2018';
    protected $pass = '2DcdCZnTfj';

    protected $url = 'https://distribution-xml.booking.com/2.0/json/';
    protected $hotelsUrl = '/hotels';

    protected $params = array();
    protected $limit = 10;

    function __construct(){
        $this->params = $_REQUEST;
        $this->controller = new Controller();
        $this->model = new Model_Booking();
    }


    /**
     * @param string $id selected city id
     * @param integer $page page selected
     * @return false|string
     *
     */
    function action_getHotels(){
        if(!isset($this->params['id'])){
            $result = array(
                'status' => 'error',
                'message' =>'Not enough parameters! Parameter "id" is needed!'
            );
            return json_encode($result);
        }
        $cityId = $this->params['id'];
        $requestData = array(
            'language' => 'en',
            'city_ids' => $cityId,
            'extras' => 'hotel_description,hotel_facilities,hotel_info,hotel_photos,hotel_policies,payment_details',
            'rows' => '50',
        );
        $response = $this->externalRequest($this->url . $this->hotelsUrl, $requestData);
        if($response){
            $tagsArr = array();
            $result = json_decode($response);

            $tags = $this->model->getTags();
            foreach ($result->result as $id => $hotel){
                if(isset($tags[$hotel->hotel_id])){
                    $result->result[$id]->tags = $tags[$hotel->hotel_id];
                    $tagsArr = array_merge(array_diff($tags[$hotel->hotel_id],$tagsArr),$tagsArr);
                }
            }
            $tagsResult = array();
            foreach ($tagsArr as $tag){
                $tagsResult[] = array('label' => $tag);
            }
            if(isset($this->params['page'])){
                $result->result = array_slice($result->result,($this->params['page']-1)*$this->limit, $this->limit);
            }
            $result = array(
                'status' => 'ok',
                'result' => json_decode(json_encode($result->result)),
                'tags' => $tagsResult,
            );
            return json_encode($result);

        } else {
            $result = array(
                'status' => 'error',
                'message' => 'Booking API is not responding!'
            );
            return json_encode($result);
        }
    }


    /**
     * @param string $id selected city id
     * @param integer $page page selected
     * @param string $tags comma-separated tags
     * @return false|string
     */
    function action_getHotelsByTag(){
        if(!isset($this->params['id'])){
            $result = array(
                'status' => 'error',
                'message' =>'Not enough parameters! Parameter "id" is needed!'
            );
            return json_encode($result);
        }
        $hotels = json_decode($this->action_getHotels());
        if ($hotels && $hotels->status == 'ok'){
            if(!isset($this->params['tags'])){
                if(isset($this->params['page'])){
                    $hotels->result = array_slice($hotels->result,($this->params['page']-1)*$this->limit, $this->limit);
                }
                $result = array(
                    'status' => 'ok',
                    'result' => json_decode(json_encode($hotels->result)),
                    'tags' => json_decode(json_encode($hotels->tags)),
                );
                return json_encode($result);
            }
            $hotelsArr = array();
            $tagsArr = explode(',', $this->params['tags']);
            if(!empty($tagsArr)){
                foreach ($hotels->result as $hotel){
                    if(isset($hotel->tags)){
                        if(count(array_intersect($hotel->tags,$tagsArr)) == count($tagsArr)){
                            $hotelsArr[] = $hotel;
                        }
                    }
                }
                if(isset($this->params['page'])){
                    $hotels->result = array_slice($hotels->result,($this->params['page']-1)*$this->limit, $this->limit);
                }
                $result = array(
                    'status' => 'ok',
                    'result' => json_decode(json_encode($hotelsArr)),
                    'tags' => json_decode(json_encode($hotels->tags))
                );
                return json_encode($result);
            }
        } else {
            $result = array(
                'status' => 'error',
                'message' => 'Booking API is not responding!'
            );
            return json_encode($result);
        }
    }

    private function externalRequest($url, $data)
    {
        $curl = curl_init();
        $options = array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $data,
            CURLOPT_DNS_USE_GLOBAL_CACHE => false,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_USERPWD => $this->login .':'.$this->pass,
        );
        curl_setopt_array($curl, $options);
        $out = curl_exec($curl);
        curl_close($curl);
        return $out;
    }

}