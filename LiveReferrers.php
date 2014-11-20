<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 *
 */
namespace Piwik\Plugins\LiveReferrers;

use Piwik\WidgetsList;

/**
 */
class LiveReferrers extends \Piwik\Plugin
{
    /**
     * @see Piwik\Plugin::getListHooksRegistered
     */
    public function getListHooksRegistered()
    {
        return array(
            'AssetManager.getJavaScriptFiles' => 'getJsFiles',
            'AssetManager.getStylesheetFiles' => 'getStylesheetFiles',
            'WidgetsList.addWidgets' => 'addWidget',
        );
    }

    public function getJsFiles(&$jsFiles)
    {
        $jsFiles[] = 'plugins/LiveReferrers/javascripts/livereferrers.js';
    }

    public function getStylesheetFiles(&$stylesheets)
    {
        $stylesheets[] = "plugins/LiveReferrers/stylesheets/livereferrers.css";
    }

    /**
     * Add Widget to Live! >
     */
    public function addWidget()
    {
        WidgetsList::add( 'Live!', 'LiveReferrers_WidgetName', 'LiveReferrers', 'index');
    }

}
