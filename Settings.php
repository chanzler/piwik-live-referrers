<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 *
 */
namespace Piwik\Plugins\LiveReferrers;

use Piwik\Settings\SystemSetting;
use Piwik\Settings\UserSetting;
use Piwik\Piwik;

/**
 * Defines Settings for LiveReferrersPlugin.
 *
 */
class Settings extends \Piwik\Plugin\Settings
{
    /** @var SystemSetting */
    public $refreshInterval;

    /** @var SystemSetting */
    public $numberOfEntries;
	
    protected function init()
    {
        $this->setIntroduction(Piwik::translate('LiveReferrers_SettingsIntroduction'));

        // System setting --> textbox converted to int defining a validator and filter
        $this->createRefreshIntervalSetting();

        // System setting --> textbox converted to int defining a validator and filter
        $this->createNumberOfEntriesSetting();
        
    }

    private function createRefreshIntervalSetting()
    {
        $this->refreshInterval        = new SystemSetting('refreshInterval', Piwik::translate('LiveReferrers_SettingsRefreshInterval'));
        $this->refreshInterval->readableByCurrentUser = true;
        $this->refreshInterval->type  = static::TYPE_INT;
        $this->refreshInterval->uiControlType = static::CONTROL_TEXT;
        $this->refreshInterval->uiControlAttributes = array('size' => 3);
        $this->refreshInterval->description     = Piwik::translate('LiveReferrers_SettingsRefreshIntervalDescription');
        $this->refreshInterval->inlineHelp      = Piwik::translate('LiveReferrers_SettingsRefreshIntervalHelp');
        $this->refreshInterval->defaultValue    = '30';
        $this->refreshInterval->validate = function ($value, $setting) {
            if ($value < 1) {
                throw new \Exception('Value is invalid');
            }
        };

        $this->addSetting($this->refreshInterval);
    }

    private function createNumberOfEntriesSetting()
    {
        $this->numberOfEntries        = new SystemSetting('numberOfEntries', Piwik::translate('LiveReferrers_SettingsNumber'));
        $this->numberOfEntries->readableByCurrentUser = true;
        $this->numberOfEntries->type  = static::TYPE_INT;
        $this->numberOfEntries->uiControlType = static::CONTROL_TEXT;
        $this->numberOfEntries->uiControlAttributes = array('size' => 3);
        $this->numberOfEntries->description     = Piwik::translate('LiveReferrers_SettingsNumberDescription');
        $this->numberOfEntries->inlineHelp      = Piwik::translate('LiveReferrers_SettingsNumberHelp');
        $this->numberOfEntries->defaultValue    = '15';
        $this->numberOfEntries->validate = function ($value, $setting) {
            if ($value > 30 && $value < 10) {
                throw new \Exception('Value is invalid');
            }
        };

        $this->addSetting($this->numberOfEntries);
    }

}
