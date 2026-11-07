export type SocialPlatform = 'instagram' | 'linkedin' | 'twitter' | 'youtube';

export type PostStatus = 'draft' | 'pending_approval' | 'scheduled' | 'published';

export type VideoStyle = 
  | 'style_01_cinematic_teaser'
  | 'style_02_pov_hands_on'
  | 'style_03_before_after'
  | 'style_04_bento_grid'
  | 'style_05_micro_feature'
  | 'style_06_terminal_cyber'
  | 'style_07_interactive_3d'
  | 'style_08_kinetic_text'
  | 'style_09_pain_to_relief'
  | 'style_10_satisfying_loop';

export interface SocialPost {
  id: string;
  project: string;
  title: string;
  caption: string;
  hashtags: string[];
  platform: SocialPlatform;
  status: PostStatus;
  videoUrl: string;
  thumbnailUrl?: string;
  styleName: string;
  scheduledFor: string; // ISO String
  source: 'agent' | 'human';
  metrics?: {
    views?: number;
    likes?: number;
    shares?: number;
  };
}
