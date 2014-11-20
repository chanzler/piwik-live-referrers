<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 *
 */
namespace Piwik\Plugins\LiveReferrers;

use Piwik\Piwik;
use Piwik\API\Request;
use \DateTimeZone;
use Piwik\Site;
use Piwik\Common;
use DeviceDetector\Parser\Device\DeviceParserAbstract;

/**
 * API for plugin ConcurrentsByTrafficSource
 *
 */
class API extends \Piwik\Plugin\API {

	private static function get_timezone_offset($remote_tz, $origin_tz = null) {
    		if($origin_tz === null) {
        		if(!is_string($origin_tz = date_default_timezone_get())) {
            			return false; // A UTC timestamp was returned -- bail out!
        		}
    		}
			if (preg_match("/^UTC[-+]*/", $origin_tz)){
				return(substr($origin_tz, 3));
    		}
    		$origin_dtz = new \DateTimeZone($origin_tz);
    		$remote_dtz = new \DateTimeZone($remote_tz);
    		$origin_dt = new \DateTime("now", $origin_dtz);
    		$remote_dt = new \DateTime("now", $remote_dtz);
    		$offset = $origin_dtz->getOffset($origin_dt) - $remote_dtz->getOffset($remote_dt);
    		return $offset;
	}
	
	private static function startsWith($haystack, $needle){
    	return $needle === "" || strpos($haystack, $needle) === 0;
	}
	
	/**
     * Retrieves visit count from lastMinutes and peak visit count from lastDays
     * in lastMinutes interval for site with idSite.
     *
     * @param int $idSite
     * @param int $lastMinutes
     * @param int $lastDays
     * @return int
     */
    public static function getLiveReferrers($idSite, $lastMinutes=20)
    {
        \Piwik\Piwik::checkUserHasViewAccess($idSite);
		$settings = new Settings('LiveReferrers');
        $numberOfEntries = (int)$settings->numberOfEntries->getValue();
        $timeZoneDiff = API::get_timezone_offset('UTC', Site::getTimezoneFor($idSite));
		if (preg_match("/^UTC[-+]*/", Site::getTimezoneFor($idSite))){
			$origin_dtz = new \DateTimeZone("UTC");
			$origin_dt = new \DateTime("now", $origin_dtz);
			$origin_dt->modify( substr($origin_tz, 3).' hour' );			
    	} else {
			$origin_dtz = new \DateTimeZone(Site::getTimezoneFor($idSite));
			$origin_dt = new \DateTime("now", $origin_dtz);
    	}
		$refTime = $origin_dt->format('Y-m-d H:i:s');
		$resultArray = array();
		$index = 1;
        $sql = "SELECT referer_name, COUNT(referer_name) AS number
	            FROM " . \Piwik\Common::prefixTable("log_visit") . "
        		WHERE idsite = ?
				AND DATE_SUB('".$refTime."', INTERVAL ? MINUTE) < visit_first_action_time
				AND referer_type > 1
				GROUP BY referer_name ORDER BY `number` DESC
                LIMIT ".$numberOfEntries;
        $referrers = \Piwik\Db::fetchAll($sql, array(
           	$idSite, $lastMinutes+($timeZoneDiff/60)+200 
       	));
		foreach ($referrers as &$referrer) {
			array_push($resultArray, array('id'=>$index, 'name'=>$referrer['referer_name'], 'value'=>$referrer['number']));
			$index++;
		}
		if (count($resultArray)==0){
			return array(array('id'=>1, 'name'=>Piwik::translate('LiveReferrers_NoReferrerFound'), 'value'=>0));
		} else {
			return $resultArray;
		}
    }

}
