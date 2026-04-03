export const coursesQuery = `*[_type == "course" && isPublished == true] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  difficulty,
  estimatedMinutes,
  "coverImage": coverImage.asset->url,
  category,
  order,
  isFeatured,
  isPublished
}`;

export const featuredCoursesQuery = `*[_type == "course" && isPublished == true && isFeatured == true] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  difficulty,
  estimatedMinutes,
  "coverImage": coverImage.asset->url,
  category,
  order,
  isFeatured,
  isPublished
}`;

export const courseBySlugQuery = `*[_type == "course" && slug.current == $slug && isPublished == true][0] {
  _id,
  title,
  "slug": slug.current,
  description,
  difficulty,
  estimatedMinutes,
  "coverImage": coverImage.asset->url,
  category,
  order,
  isFeatured,
  isPublished
}`;

export const sentencesByCourseSlugQuery = `*[_type == "sentence" && isPublished == true && course->slug.current == $slug] | order(order asc) {
  _id,
  "courseSlug": course->slug.current,
  english,
  chinese,
  pronunciationCn,
  ipa,
  audioNormal,
  audioSlow,
  audioChinese,
  tags,
  order,
  isPublished
}`;
