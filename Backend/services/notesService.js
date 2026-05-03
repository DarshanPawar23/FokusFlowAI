export const fetchCourseNotes = async (courseName) => {
  try {
    const query = `${courseName} tutorial notes filetype:pdf`;

    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CSE_ID}&q=${encodeURIComponent(query)}&num=6`
    );

    const data = await response.json();

    if (!data.items) return [];

    return data.items.map(item => ({
      title: item.title,
      link: item.link
    }));

  } catch (error) {
    console.error("Notes Search Error:", error.message);
    return [];
  }
};
