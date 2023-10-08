import db from '../config/dbConfig.js';

const Page = db.pages;

export async function getAllPages(req, res) {
  try {
    const data = await Page.findAll({
      attributes: { exclude: ['content'] },
    });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getPageBySlug(req, res) {
  const { slug } = req.params;
  try {
    const data = await Page.findOne({
      where: { slug },
    });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function createPage(req, res) {
  try {
    const data = await Page.create(req.body);
    return res.json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

export async function updatePage(req, res) {
  const { slug } = req.params;
  try {
    await Page.update(req.body, { where: { slug } });
    return res.json({ message: 'Page Updated' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function deletePage(req, res) {
  const { slug } = req.params;

  try {
    const num = await Page.destroy({ where: { slug } });
    const ifDeleted = parseInt(num, 10);
    if (ifDeleted === 1) {
      return res.json({ message: 'Page Deleted' });
    }
    return res.status(500).json({ message: 'Cannot delete page' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
