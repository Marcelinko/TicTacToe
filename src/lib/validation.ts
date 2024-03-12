import { z } from "zod";

//TODO: Translations
export const nicknameSchema = z.string().min(1, {message: 'Nickname to short'}).max(10, {message: 'Nickname to long'});