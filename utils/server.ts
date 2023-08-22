import ImageKit from 'imagekit';
import { isCDNAvatar } from './utils';
import { PrismaClient } from '@prisma/client';
import { serverSupabaseClient } from '#supabase/server';

export const prisma = new PrismaClient();

export const defaultAvatar = 'https://ik.imagekit.io/jerrywu001/supabases/default-avatar.png';

/**
 * Updates the Supabase avatar for a user.
 *
 * @param {string | null} avatar - The new avatar URL or null.
 * @param {any} event - The event object.
 */
export async function updateSupabaseAvatar(avatar: string | null, event: any) {
  const supabase = await serverSupabaseClient(event);
  supabase.auth.updateUser({
    data: {
      avatar_url: avatar || defaultAvatar,
    },
  });
}

/**
 * Uploads a Supabase avatar to imagekit cdn.
 *
 * @param {Object} data - The data object containing the following properties:
 *   - file: (string|null) The file to upload.
 *   - fileName: (string) The name of the file.
 *   - folder: (string) The folder to upload the file to. Defaults to 'supabases'.
 *   - useUniqueFileName: (boolean) Whether to use a unique file name. Defaults to false.
 *   - event: (any) The event object.
 * @param {boolean} updateSupabase - Whether to update Supabase. Defaults to false.
 */
export async function uploadSupabaseAvatar(data: {
  avatar?: string | null;
  userId: string;
  folder?: string;
  useUniqueFileName?: boolean;
}) {
  const {
    folder = 'supabases',
    useUniqueFileName = false,
    avatar,
    userId,
  } = data;

  if (!avatar || typeof avatar !== 'string') {
    return defaultAvatar;
  }

  let url = defaultAvatar;
  if (!!avatar && typeof avatar === 'string' && !isCDNAvatar(avatar)) {
    const { imageKitPublickey, imageKitPrivatekey, imageKitUrlEndpoint } = useRuntimeConfig();

    try {
      // https://docs.imagekit.io/api-reference/upload-file-api/server-side-file-upload
      const imagekit = new ImageKit({
        publicKey: imageKitPublickey,
        privateKey: imageKitPrivatekey,
        urlEndpoint: imageKitUrlEndpoint,
      });

      const res = await imagekit.upload({
        file: avatar,
        fileName: userId,
        useUniqueFileName,
        folder,
      });

      url = res.url;

      console.error('update avatar succeed');
    } catch (error) {
      console.error('update avatar error', error);
    }
  }

  return url;
}
