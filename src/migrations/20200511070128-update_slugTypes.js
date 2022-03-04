module.exports = {
  async up(db, client) {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        await db.collection('slugTypes').updateOne({ slug: 'ruralArea' }, { $set: { type: 'category', showOnApp: true } });
        await db.collection('slugTypes').updateOne({ slug: 'apartment' }, { $set: { type: 'category', showOnApp: true } });
        await db.collection('slugTypes').updateOne({ slug: 'house' }, { $set: { type: 'category', showOnApp: true } });
        await db.collection('slugTypes').updateOne({ slug: 'comercial' }, { $set: { type: 'category', showOnApp: true } });
        await db.collection('slugTypes').updateOne({ slug: 'farm' }, { $set: { type: 'category', showOnApp: true } });
        await db.collection('slugTypes').updateOne({ slug: 'land' }, { $set: { type: 'category', showOnApp: true } });
        await db.collection('slugTypes').updateOne({ slug: 'urban' }, { $set: { type: 'location', showOnApp: true } });
        await db.collection('slugTypes').updateOne({ slug: 'rural' }, { $set: { type: 'location', showOnApp: true } });
        await db.collection('slugTypes').updateOne({ slug: 'rental' }, { $set: { type: 'modality', showOnApp: true } });
        await db.collection('slugTypes').updateOne({ slug: 'sale' }, { $set: { type: 'modality', showOnApp: true } });
        await db.collection('slugTypes').updateOne({ slug: 'lease' }, { $set: { type: 'modality', showOnApp: true } });
      });
    } finally {
      await session.endSession();
    }
  },

  async down(db, client) {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        await db.collection('slugTypes').deleteOne({ slug: 'ruralArea' });
        await db.collection('slugTypes').deleteOne({ slug: 'apartment' });
        await db.collection('slugTypes').deleteOne({ slug: 'house' });
        await db.collection('slugTypes').deleteOne({ slug: 'comercial' });
        await db.collection('slugTypes').deleteOne({ slug: 'farm' });
        await db.collection('slugTypes').deleteOne({ slug: 'land' });
        await db.collection('slugTypes').deleteOne({ slug: 'urban' });
        await db.collection('slugTypes').deleteOne({ slug: 'rural' });
        await db.collection('slugTypes').deleteOne({ slug: 'rental' });
        await db.collection('slugTypes').deleteOne({ slug: 'sale' });
        await db.collection('slugTypes').deleteOne({ slug: 'lease' });
      });
    } finally {
      await session.endSession();
    }
  }
};
