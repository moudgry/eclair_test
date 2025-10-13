'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Mark some categories as featured
    await queryInterface.bulkUpdate('categories',
      { isFeatured: true, sortOrder: 1 },
      { name: 'Electronics' }
    );

    await queryInterface.bulkUpdate('categories',
      { isFeatured: true, sortOrder: 2 },
      { name: 'Clothing' }
    );

    // Mark some products as featured
    await queryInterface.bulkUpdate('products',
      { isFeatured: true },
      { name: 'PlayStation 5' }
    );

    await queryInterface.bulkUpdate('products',
      { isFeatured: true },
      { name: 'iPhone 13' }
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Reset featured flags
    await queryInterface.bulkUpdate('categories',
      { isFeatured: false, sortOrder: 0 },
      { isFeatured: true }
    );

    await queryInterface.bulkUpdate('products',
      { isFeatured: false },
      { isFeatured: true }
    );
  }
};
