
export interface Material {
  id: number;
  name: string;
  description: string;
  module_id: number;
  type: 'document' | 'video' | 'link' | 'file';
  content_url: string;
  order: number;
  file_type?: string;
  file_size?: number;
}