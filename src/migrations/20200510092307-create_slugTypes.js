module.exports = {
  async up(db, client) {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        await db.collection('slugTypes').insertOne({ description: 'Área Rural', slug: 'ruralArea' });
        await db.collection('slugTypes').insertOne({ description: 'Apartamento', slug: 'apartment' });
        await db.collection('slugTypes').insertOne({ description: 'Casa', slug: 'house' });
        await db.collection('slugTypes').insertOne({ description: 'Comercial', slug: 'comercial' });
        await db.collection('slugTypes').insertOne({ description: 'Fazenda', slug: 'farm' });
        await db.collection('slugTypes').insertOne({ description: 'Terreno', slug: 'land' });
        await db.collection('slugTypes').insertOne({ description: 'Urbano', slug: 'urban' });
        await db.collection('slugTypes').insertOne({ description: 'Rural', slug: 'rural' });
        await db.collection('slugTypes').insertOne({ description: 'Aluga', slug: 'rental' });
        await db.collection('slugTypes').insertOne({ description: 'Venda', slug: 'sale' });
        await db.collection('slugTypes').insertOne({ description: 'Arrendamento', slug: 'lease' });
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
