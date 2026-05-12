import * as migration_20260505_115337_payload_init from './20260505_115337_payload_init';
import * as migration_20260505_131513_cms_foundation from './20260505_131513_cms_foundation';
import * as migration_20260505_143431_page_builder_design_controls from './20260505_143431_page_builder_design_controls';
import * as migration_20260505_150545_visual_builder_puck from './20260505_150545_visual_builder_puck';
import * as migration_20260505_163224_wysiwyg_menus from './20260505_163224_wysiwyg_menus';
import * as migration_20260505_181210_themes_and_templates from './20260505_181210_themes_and_templates';
import * as migration_20260505_185957_theme_settings from './20260505_185957_theme_settings';
import * as migration_20260505_195112_code_snippets from './20260505_195112_code_snippets';
import * as migration_20260506_232900_support_tickets_and_menu_dropdowns from './20260506_232900_support_tickets_and_menu_dropdowns';
import * as migration_20260507_160500_help_articles_and_templates from './20260507_160500_help_articles_and_templates';
import * as migration_20260508_094500_help_article_builder_data from './20260508_094500_help_article_builder_data';
import * as migration_20260511_153000_featured_help_article_placeholders from './20260511_153000_featured_help_article_placeholders';
import * as migration_20260511_160000_help_article_analytics from './20260511_160000_help_article_analytics';
import * as migration_20260512_123700_help_article_analytics_locked_documents_rel from './20260512_123700_help_article_analytics_locked_documents_rel';
import * as migration_20260512_141500_remove_unused_page_templates from './20260512_141500_remove_unused_page_templates';
import * as migration_20260512_143000_move_theme_settings_into_themes from './20260512_143000_move_theme_settings_into_themes';

export const migrations = [
  {
    up: migration_20260505_115337_payload_init.up,
    down: migration_20260505_115337_payload_init.down,
    name: '20260505_115337_payload_init',
  },
  {
    up: migration_20260505_131513_cms_foundation.up,
    down: migration_20260505_131513_cms_foundation.down,
    name: '20260505_131513_cms_foundation',
  },
  {
    up: migration_20260505_143431_page_builder_design_controls.up,
    down: migration_20260505_143431_page_builder_design_controls.down,
    name: '20260505_143431_page_builder_design_controls',
  },
  {
    up: migration_20260505_150545_visual_builder_puck.up,
    down: migration_20260505_150545_visual_builder_puck.down,
    name: '20260505_150545_visual_builder_puck',
  },
  {
    up: migration_20260505_163224_wysiwyg_menus.up,
    down: migration_20260505_163224_wysiwyg_menus.down,
    name: '20260505_163224_wysiwyg_menus',
  },
  {
    up: migration_20260505_181210_themes_and_templates.up,
    down: migration_20260505_181210_themes_and_templates.down,
    name: '20260505_181210_themes_and_templates',
  },
  {
    up: migration_20260505_185957_theme_settings.up,
    down: migration_20260505_185957_theme_settings.down,
    name: '20260505_185957_theme_settings',
  },
  {
    up: migration_20260505_195112_code_snippets.up,
    down: migration_20260505_195112_code_snippets.down,
    name: '20260505_195112_code_snippets'
  },
  {
    up: migration_20260506_232900_support_tickets_and_menu_dropdowns.up,
    down: migration_20260506_232900_support_tickets_and_menu_dropdowns.down,
    name: '20260506_232900_support_tickets_and_menu_dropdowns'
  },
  {
    up: migration_20260507_160500_help_articles_and_templates.up,
    down: migration_20260507_160500_help_articles_and_templates.down,
    name: '20260507_160500_help_articles_and_templates'
  },
  {
    up: migration_20260508_094500_help_article_builder_data.up,
    down: migration_20260508_094500_help_article_builder_data.down,
    name: '20260508_094500_help_article_builder_data'
  },
  {
    up: migration_20260511_153000_featured_help_article_placeholders.up,
    down: migration_20260511_153000_featured_help_article_placeholders.down,
    name: '20260511_153000_featured_help_article_placeholders'
  },
  {
    up: migration_20260511_160000_help_article_analytics.up,
    down: migration_20260511_160000_help_article_analytics.down,
    name: '20260511_160000_help_article_analytics'
  },
  {
    up: migration_20260512_123700_help_article_analytics_locked_documents_rel.up,
    down: migration_20260512_123700_help_article_analytics_locked_documents_rel.down,
    name: '20260512_123700_help_article_analytics_locked_documents_rel'
  },
  {
    up: migration_20260512_141500_remove_unused_page_templates.up,
    down: migration_20260512_141500_remove_unused_page_templates.down,
    name: '20260512_141500_remove_unused_page_templates'
  },
  {
    up: migration_20260512_143000_move_theme_settings_into_themes.up,
    down: migration_20260512_143000_move_theme_settings_into_themes.down,
    name: '20260512_143000_move_theme_settings_into_themes'
  },
];
