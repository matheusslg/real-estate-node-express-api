var Property = require('../models/property');
var SlugType = require('../models/slugType');
var moment = require('moment');
var mongoose = require('mongoose');

var paginate = function(array, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}

var groupBy = function(list, keyGetter){
    const map = new Map();
    list.forEach(function(item) {
      const key = item[keyGetter];
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
};

// Display list of all Properties.
exports.propertyList = function (req, res) {
    let body = {};
    if (req.query.active == 'true' || req.query.active == 'false') { body.active = req.query.active; }
    if (req.query.featured == 'true' || req.query.featured == 'false') { body.featured = req.query.featured; }
    Property.find(body)
        .sort({'createdAt': 'desc'})
        .populate(['locations', 'categories', 'types', 'city', 'createdBy', 'images', 'tags'])
        .skip(req.query.skip ? parseInt(req.query.skip) : 0)
        .limit(req.query.limit ? parseInt(req.query.limit) : 1000)
        .exec()
        .then(doc => {
            res.status(200).json({
                count: doc.length,
                data: doc
            });
        })
        .catch(err => { 
            res.status(500).json({
                message: 'Não foi possível trazer os dados',
                success: false,
                error: err
            });
        });
};

// Display list of Properties with advanced filtering.
exports.propertiesFilter = async function (req, res) {
    let body = {};

    // title filtering
    if (req.query.title) { body.title = { "$regex": req.query.title, "$options": "i" } };

    // address filtering
    if (req.query.address) { body.address = { "$regex": req.query.address, "$options": "i" } };

    // locations filtering
    if (req.query.locations) {
        if (req.query.locations.indexOf(',') !== -1) {
            var locations = req.query.locations.split(',');
            var values = [];
            locations.forEach(function(_id) {
                var id = _id.replace(/[^\w\s]/gi, '');
                if (mongoose.Types.ObjectId.isValid(id)) {
                    values.push(mongoose.Types.ObjectId(id));
                }
            });
            body.locations = { $in: values };
        } else {
            if (mongoose.Types.ObjectId.isValid(req.query.locations)) {
                body.locations = { _id: mongoose.Types.ObjectId(req.query.locations) };
            }
        }
    }

    // categories filtering
    if (req.query.categories) {
        if (req.query.categories.indexOf(',') !== -1) {
            var categories = req.query.categories.split(',');
            var values = [];
            categories.forEach(function(_id) {
                var id = _id.replace(/[^\w\s]/gi, '');
                if (mongoose.Types.ObjectId.isValid(id)) {
                    values.push(mongoose.Types.ObjectId(id));
                }
            });
            body.categories = { $in: values };
        } else {
            if (mongoose.Types.ObjectId.isValid(req.query.categories)) {
                body.categories = { _id: mongoose.Types.ObjectId(req.query.categories) };
            }
        }
    }

    // types filtering
    if (req.query.types) {
        if (req.query.types.indexOf(',') !== -1) {
            var types = req.query.types.split(',');
            var values = [];
            types.forEach(function(_id) {
                var id = _id.replace(/[^\w\s]/gi, '');
                if (mongoose.Types.ObjectId.isValid(id)) {
                    values.push(mongoose.Types.ObjectId(id));
                }
            });
            body.types = { $in: values };
        } else {
            if (mongoose.Types.ObjectId.isValid(req.query.types)) {
                body.types = { _id: mongoose.Types.ObjectId(req.query.types) };
            }
        }
    }

    // cities filtering
    if (req.query.cities) {
        if (req.query.cities.indexOf(',') !== -1) {
            var cities = req.query.cities.split(',');
            var ids = [];
            cities.forEach(function(_id) {
                var id = _id.replace(/[^\w\s]/gi, '');
                if (mongoose.Types.ObjectId.isValid(id)) {
                    ids.push(mongoose.Types.ObjectId(id));
                }
            });
            body.city = { $in: ids };
        } else {
            if (mongoose.Types.ObjectId.isValid(req.query.cities)) {
                body.city = { _id: mongoose.Types.ObjectId(req.query.cities) };
            }
        }
    }

    // bedrooms filtering
    if (req.query.bedroomsMin && req.query.bedroomsMax) { body.bedrooms = { $gte: Number(req.query.bedroomsMin.replace(/[^\w\s]/gi, '')), $lte: Number(req.query.bedroomsMax.replace(/[^\w\s]/gi, '')) } }; // bedrooms >= && <=
    if (req.query.bedroomsMin && !req.query.bedroomsMax) { body.bedrooms = { $gte: Number(req.query.bedroomsMin.replace(/[^\w\s]/gi, '')) } }; // bedrooms >=
    if (!req.query.bedroomsMin && req.query.bedroomsMax) { body.bedrooms = { $lte: Number(req.query.bedroomsMax.replace(/[^\w\s]/gi, '')) } }; // bedrooms <=

    // toilets filtering
    if (req.query.toiletsMin && req.query.toiletsMax) { body.toilets = { $gte: Number(req.query.toiletsMin.replace(/[^\w\s]/gi, '')), $lte: Number(req.query.toiletsMax.replace(/[^\w\s]/gi, '')) } }; // toilets >= && <=
    if (req.query.toiletsMin && !req.query.toiletsMax) { body.toilets = { $gte: Number(req.query.toiletsMin.replace(/[^\w\s]/gi, '')) } }; // toilets >=
    if (!req.query.toiletsMin && req.query.toiletsMax) { body.toilets = { $lte: Number(req.query.toiletsMax.replace(/[^\w\s]/gi, '')) } }; // toilets <=

    // garage filtering
    if (req.query.garageMin && req.query.garageMax) { body.garage = { $gte: Number(req.query.garageMin.replace(/[^\w\s]/gi, '')), $lte: Number(req.query.garageMax.replace(/[^\w\s]/gi, '')) } }; // garage >= && <=
    if (req.query.garageMin && !req.query.garageMax) { body.garage = { $gte: Number(req.query.garageMin.replace(/[^\w\s]/gi, '')) } }; // garage >=
    if (!req.query.garageMin && req.query.garageMax) { body.garage = { $lte: Number(req.query.garageMax.replace(/[^\w\s]/gi, '')) } }; // garage <=

    // featured filtering
    if (req.query.featured == 'true') { body.featured = req.query.featured; };

    // active filtering
    if (req.query.active == 'true' || req.query.active == 'false') { body.active = req.query.active; };

    // priceType default value
    if (!req.query.priceType) { req.query.priceType = 'all'; };

    // sizeType default value
    if (!req.query.sizeType) { req.query.sizeType = 'metro'; };

    var slugTypes = [];
    await SlugType.find()
        .exec()
        .then(doc => {
            slugTypes = doc;
        })
        .catch(err => { 
            res.status(500).json({
                message: 'Não foi possível trazer os slugs',
                success: false,
                error: err
            });
        });

    Property.find(body)
        .sort({'createdAt': 'desc'})
        .populate([
            'locations',
            'categories', 
            'types', 
            'city', 
            'createdBy', 
            'images', 
            'tags'
        ])
        .exec()
        .then(doc => {

            var filteredBySlug = [];
            var filteredByPrice = [];
            var filteredBySize = [];
            var filtered = [];

            var counters = {
                locations: {},
                categories: {},
                types: {},
                cities: {},
                prices: {
                    all: 0,
                    hectare: 0,
                    soja: 0
                },
                sizes: {
                    metro: 0,
                    hectare: 0
                },
                featured: 0
            };

            var addToCount = function(type) {
                if (type === 'all') {
                    counters.prices.all++;
                } else if (type === 'hectare') {
                    counters.prices.hectare++;
                } else if (type === 'soja') {
                    counters.prices.soja++;
                } else if (type === 'metro') {
                    counters.sizes.metro++;
                } else if (type === 'ha') {
                    counters.sizes.hectare++;
                }
            }

            // Filter by Slug
            if (req.query.slug && !mongoose.Types.ObjectId.isValid(req.query.slug)) {
                doc.forEach(_property => {
                    _property.locations.forEach(_location => {
                        slugTypes.forEach(_slugType => {
                            if (JSON.stringify(_location.slugType) == JSON.stringify(_slugType._id)) {
                                if (_slugType.slug === req.query.slug) {
                                    filteredBySlug.push(_property);
                                }
                            }
                        });
                    });
                    _property.categories.forEach(_category => {
                        slugTypes.forEach(_slugType => {
                            if (JSON.stringify(_category.slugType) == JSON.stringify(_slugType._id)) {
                                if (_slugType.slug === req.query.slug) {
                                    filteredBySlug.push(_property);
                                }
                            }
                        });
                    });
                    _property.types.forEach(_type => {
                        slugTypes.forEach(_slugType => {
                            if (JSON.stringify(_type.slugType) == JSON.stringify(_slugType._id)) {
                                if (_slugType.slug === req.query.slug) {
                                    filteredBySlug.push(_property);
                                }
                            }
                        });
                    });
                });
            } else {
                filteredBySlug = doc;
            }

            // Filter by Price
            filteredBySlug.forEach(function(_property) {

                var priceRequestedMin = req.query.priceMin ? Number(req.query.priceMin.replace(/[^\w\s]/gi, '').match(/\d+/g)) : 0;
                var priceRequestedMax = req.query.priceMax ? Number(req.query.priceMax.replace(/[^\w\s]/gi, '').match(/\d+/g)) : 0;

                if (_property.priceCustom) {

                    var price;

                    var addByPrice = function(type) {
                        if (priceRequestedMin >= 0 && priceRequestedMax >= 0) { // price >= && <=
                            if (price && (price >= priceRequestedMin && (priceRequestedMax ? price <= priceRequestedMax : true))) {
                                filteredByPrice.push(_property);
                                addToCount(type);
                            }
                        } else if (priceRequestedMin === 0 && priceRequestedMax === 0) {
                            filteredByPrice.push(_property); // return all
                            addToCount(type);
                        }
                    }

                    if (_property.priceCustom.match(/\d+/g) && _property.priceCustom.indexOf('R$') !== -1 && _property.priceCustom.indexOf('/ha') !== -1 && (req.query.priceType === 'hectare' || req.query.priceType === 'all')) { // example: 'R$ 20.000,00/ha'
                        price = _property.priceCustom.split(',')[0].replace(/[^\w\s]/gi, '').match(/\d+/g).map(Number)[0];
                        addByPrice('hectare');
                    } else if (_property.priceCustom.match(/\d+/g) && _property.priceCustom.indexOf('R$') === -1  && _property.priceCustom.indexOf('soja') !== -1 && (req.query.priceType === 'soja' || req.query.priceType === 'all')) { // example: '300 sacas de soja/ha'
                        price = _property.priceCustom.replace(/[^\w\s]/gi, '').match(/\d+/g).map(Number)[0];
                        addByPrice('soja');
                    } else {
                        if (req.query.priceType == 'all' && _property.priceCustom.indexOf('R$') !== -1) {
                            price = _property.priceCustom.split('por')[1].replace(',00', '').replace(/[^\w\s]/gi, '').match(/\d+/g).map(Number)[0]; // example: 'De R$ 150.000,00 por R$ 140.000,00'
                            addByPrice('all');
                        } else if (req.query.priceType == 'hectare' && _property.priceCustom.indexOf('R$') === -1 && _property.priceCustom.indexOf('soja') === -1) {
                            _property.locations.forEach(function(_location) {
                                if (_location.description.toLowerCase().indexOf('rural') !== -1) {
                                    filteredByPrice.push(_property);
                                    addToCount('hectare');
                                }
                            });
                        } else if (req.query.priceType == 'soja' && _property.priceCustom.indexOf('R$') === -1 && _property.priceCustom.indexOf('soja') === -1) {
                            _property.locations.forEach(function(_location) {
                                if (_location.description.toLowerCase().indexOf('rural') !== -1) {
                                    filteredByPrice.push(_property);
                                    addToCount('soja');
                                }
                            });
                        } else if (req.query.priceType == 'all') { // is Urban
                            filteredByPrice.push(_property);
                            addToCount('all');
                        }
                    }

                } else if (_property.priceNumber >= 0 && req.query.priceType === 'all') {
                    if (priceRequestedMin >= 0 && priceRequestedMax >= 0) { // priceNumber >= && <=
                        if (_property.priceNumber >= 0 && (_property.priceNumber >= priceRequestedMin && (priceRequestedMax ? _property.priceNumber <= priceRequestedMax : true))) {
                            filteredByPrice.push(_property);
                            addToCount('all');
                        }
                    } else if (priceRequestedMin === 0 && priceRequestedMax === 0) {
                        filteredByPrice.push(_property); // return all
                        addToCount('all');
                    }

                }

            });

            // Filter by Size
            filteredByPrice.forEach(function(_property) {

                var sizeRequestedMin = req.query.sizeMin ? Number(req.query.sizeMin.replace(/[^\w\s]/gi, '').match(/\d+/g)) : 0;
                var sizeRequestedMax = req.query.sizeMax ? Number(req.query.sizeMax.replace(/[^\w\s]/gi, '').match(/\d+/g)) : 0;

                if ((req.query.sizeType === 'metro' || req.query.sizeType === 'hectare') && sizeRequestedMin === 0 && sizeRequestedMax === 0) {
                    filteredBySize.push(_property);
                    
                    if (_property.size && _property.size.indexOf('m') !== -1) {
                        addToCount('metro');
                    } else if (_property.size && _property.size.indexOf('ha') !== -1) {
                        addToCount('ha');
                    }

                } else {

                    if (req.query.sizeType === 'metro' && (_property.size && _property.size.indexOf('m') !== -1)) {
                        
                        var totalSize;

                        if (_property.size.indexOf('²') === -1) {
                            var sizeMetro = _property.size.split('m')[0];
                            var sizeX;
                            var sizeY;
                            if (sizeMetro.indexOf('x') !== -1) {
                                sizeX = Number(sizeMetro.split('x')[0].replace(',', '.'));
                                sizeY = Number(sizeMetro.split('x')[1].replace(',', '.'));
                                totalSize = sizeX * sizeY;
                            }
                        } else {
                            totalSize = Number(_property.size.split('m²')[0]);
                        }

                        if (sizeRequestedMin >= 0 && sizeRequestedMax >= 0) { // totalSize >= && <=
                            if (totalSize && (totalSize >= sizeRequestedMin && (sizeRequestedMax ? totalSize <= sizeRequestedMax : true))) {
                                filteredBySize.push(_property);
                                addToCount('metro');
                            }
                        }

                    } else if (req.query.sizeType === 'hectare' && (_property.size && _property.size.indexOf('ha') !== -1)) {

                        var sizeHectare = Number(_property.size.split('ha')[0]);

                        if (sizeRequestedMin >= 0 && sizeRequestedMax >= 0) { // sizeHectare >= && <=
                            if (sizeHectare && (sizeHectare >= sizeRequestedMin && (sizeRequestedMax ? sizeHectare <= sizeRequestedMax : true))) {
                                filteredBySize.push(_property);
                                addToCount('ha');
                            }
                        }

                    }

                }

            });

            // Final Array
            filtered = filteredBySize; // Last array filtered

            // Counters
            var locationsFilteredById = []
            var categoriesFilteredById = []
            var typesFilteredById = []
            var citiesFilteredById = []
            filtered.forEach(res => {
                locationsFilteredById.push(res.locations.map(c => c._id));
                categoriesFilteredById.push(res.categories.map(c => c._id));
                typesFilteredById.push(res.types.map(c => c._id));
                citiesFilteredById.push(res.city._id);
                res.featured ? counters.featured++ : null;
            })

            var locationsDismembered = []
            locationsFilteredById.forEach(res =>{                    
                locationsDismembered = locationsDismembered.concat(res.map(res => res._id))
            })
            var categoriesDismembered = []
            categoriesFilteredById.forEach(res =>{                    
                categoriesDismembered = categoriesDismembered.concat(res.map(res => res._id))
            })
            var typesDismembered = []
            typesFilteredById.forEach(res =>{                    
                typesDismembered = typesDismembered.concat(res.map(res => res._id))
            })
            
            var locationsGroupedById = groupBy(locationsDismembered, '_id');
            locationsGroupedById.forEach(res =>{
                counters.locations[mongoose.Types.ObjectId(res[0]._id).toHexString()] = { count: res.length }
            })
            locationsGroupedById.forEach(res =>{
                counters.locations[mongoose.Types.ObjectId(res[0]._id).toHexString()] = { count: res.length }
            })
            var categoriesGroupedById = groupBy(categoriesDismembered, '_id');  
            categoriesGroupedById.forEach(res =>{
                counters.categories[mongoose.Types.ObjectId(res[0]._id).toHexString()] = { count: res.length }
            })
            var typesGroupedById = groupBy(typesDismembered, '_id');  
            typesGroupedById.forEach(res =>{
                counters.types[mongoose.Types.ObjectId(res[0]._id).toHexString()] = { count: res.length }
            })
            var citiesGroupedById = groupBy(citiesFilteredById, '_id');  
            citiesGroupedById.forEach(res =>{
                counters.cities[mongoose.Types.ObjectId(res[0]._id).toHexString()] = { count: res.length }
            })

            res.status(200).json({
                count: paginate(filtered, req.query.limit ? parseInt(req.query.limit) : 1000, req.query.page ? parseInt(req.query.page) : 1).length,
                data: paginate(filtered, req.query.limit ? parseInt(req.query.limit) : 1000, req.query.page ? parseInt(req.query.page) : 1),
                counters: counters
            });

        })
        .catch(err => { 
            res.status(500).json({
                message: 'Não foi possível trazer os dados',
                success: false,
                error: err
            });
        });
};

// Display list of Properties by Category.
exports.propertiesByCategory = function (req, res) {
    let body = { categories: { _id: req.params.id } };
    if (req.query.active == 'true' || req.query.active == 'false') { body.active = req.query.active; }
    Property.find(body)
        .sort({'createdAt': 'desc'})
        .populate(['locations', 'categories', 'types', 'city', 'createdBy', 'images', 'tags'])
        .skip(req.query.skip ? parseInt(req.query.skip) : 0)
        .limit(req.query.limit ? parseInt(req.query.limit) : 1000)
        .exec()
        .then(doc => {
            res.status(200).json({
                count: doc.length,
                data: doc
            });
        })
        .catch(err => { 
            res.status(500).json({
                message: 'Não foi possível trazer os dados',
                success: false,
                error: err
            });
        });
};

// Display list of Properties by Location.
exports.propertiesByLocation = function (req, res) {
    let body = { locations: { _id: req.params.id } };
    if (req.query.active == 'true' || req.query.active == 'false') { body.active = req.query.active; }
    Property.find(body)
        .sort({'createdAt': 'desc'})
        .populate(['locations', 'categories', 'types', 'city', 'createdBy', 'images', 'tags'])
        .skip(req.query.skip ? parseInt(req.query.skip) : 0)
        .limit(req.query.limit ? parseInt(req.query.limit) : 1000)
        .exec()
        .then(doc => {
            res.status(200).json({
                count: doc.length,
                data: doc
            });
        })
        .catch(err => { 
            res.status(500).json({
                message: 'Não foi possível trazer os dados',
                success: false,
                error: err
            });
        });
};

// Display list of Properties by Type.
exports.propertiesByType = function (req, res) {
    let body = { types: { _id: req.params.id } };
    if (req.query.active == 'true' || req.query.active == 'false') { body.active = req.query.active; }
    Property.find(body)
        .sort({'createdAt': 'desc'})
        .populate(['locations', 'categories', 'types', 'city', 'createdBy', 'images', 'tags'])
        .skip(req.query.skip ? parseInt(req.query.skip) : 0)
        .limit(req.query.limit ? parseInt(req.query.limit) : 1000)
        .exec()
        .then(doc => {
            res.status(200).json({
                count: doc.length,
                data: doc
            });
        })
        .catch(err => { 
            res.status(500).json({
                message: 'Não foi possível trazer os dados',
                success: false,
                error: err
            });
        });
};

// Display list of Properties by City.
exports.propertiesByCity = function (req, res) {
    let body = { city: { _id: req.params.id } };
    if (req.query.active == 'true' || req.query.active == 'false') { body.active = req.query.active; }
    Property.find(body)
        .sort({'createdAt': 'desc'})
        .populate(['locations', 'categories', 'types', 'city', 'createdBy', 'images', 'tags'])
        .skip(req.query.skip ? parseInt(req.query.skip) : 0)
        .limit(req.query.limit ? parseInt(req.query.limit) : 1000)
        .exec()
        .then(doc => {
            res.status(200).json({
                count: doc.length,
                data: doc
            });
        })
        .catch(err => { 
            res.status(500).json({
                message: 'Não foi possível trazer os dados',
                success: false,
                error: err
            });
        });
};

// Display detail page for a specific property.
exports.propertyDetail = function (req, res) {
    Property.findOne({ _id: req.params.id })
        .populate(['locations', 'categories', 'types', 'city', 'createdBy', 'images', 'tags'])
        .exec()
        .then(doc => {
            res.status(200).json({
                data: doc
            });
        })
        .catch(err => { 
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Propriedade não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao buscar a propriedade!',
                    success: false,
                    error: err
                });
            }
        });
};

// Handle property create on POST.
exports.propertyCreate = function (req, res) {
    var property = new Property({
        title: req.body.title,
        description: req.body.description,
        address: req.body.address,
        locations: req.body.locations,
        categories: req.body.categories,
        types: req.body.types,
        city: req.body.city,
        geolocation: req.body.geolocation,
        bedrooms: req.body.bedrooms,
        toilets: req.body.toilets,
        garage: req.body.garage,
        size: req.body.size,
        tags: req.body.tags,
        images: req.body.images,
        priceNumber: req.body.priceNumber,
        priceCustom: req.body.priceCustom,
        createdBy: req.body.user,
        active: req.body.active,
        featured: req.body.featured,
        advise: req.body.advise,
        createdAt: moment().format(),
        updatedAt: moment().format()
    })
    property.save().then(result => {
        res.status(200).json({
            message: 'Propriedade criada com sucesso!',
            success: true,
            result: result
        });
    }).catch(err => {
        res.status(500).json({
            message: 'Ocorreu um erro ao salvar a propriedade!',
            success: false,
            error: err
        });
    });
};

// Handle property disable on POST.
exports.propertyDisable = function (req, res) {
    Property.findOneAndUpdate({ _id: req.params.id }, { $set: { active: false }}, null)
        .then(result => {
            res.status(200).json({
                message: 'Propriedade desativada com sucesso!',
                success: true
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Propriedade não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao desativar a propriedade!',
                    success: false,
                    error: err
                });
            }
        })
};

// Handle property enable on POST.
exports.propertyEnable = function (req, res) {
    Property.findOneAndUpdate({ _id: req.params.id }, { $set: { active: true }}, null)
        .then(result => {
            res.status(200).json({
                message: 'Propriedade reativada com sucesso!',
                success: true
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Propriedade não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao reativar a propriedade!',
                    success: false,
                    error: err
                });
            }
        })
};

// Handle property update on POST.
exports.propertyUpdate = function (req, res) {
    var property = {
        title: req.body.title,
        description: req.body.description,
        address: req.body.address,
        locations: req.body.locations,
        categories: req.body.categories,
        types: req.body.types,
        city: req.body.city,
        geolocation: req.body.geolocation,
        bedrooms: req.body.bedrooms,
        toilets: req.body.toilets,
        garage: req.body.garage,
        size: req.body.size,
        tags: req.body.tags,
        images: req.body.images,
        priceNumber: req.body.priceNumber,
        priceCustom: req.body.priceCustom,
        featured: req.body.featured,
        advise: req.body.advise,
        updatedAt: moment().format(),
        active: req.body.active
    };
    Property.findOneAndUpdate({ _id: req.params.id }, { $set: property }, { new: true })
        .then(result => {
            res.status(200).json({
                message: 'Propriedade atualizada com sucesso!',
                success: true,
                result: result
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Propriedade não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao atualizar a propriedade!',
                    success: false,
                    error: err
                });
            }
        })
};

exports.propertyImagesUpdate = function (req, res) {
    Property.update({ _id: req.params.id }, { images: req.body.images }, { new: true })
        .then(result => {
            res.status(200).json({
                message: 'Imagens atualizadas com sucesso!',
                success: true,
                result: result
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Propriedade não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao atualizar a propriedade!',
                    success: false,
                    error: err
                });
            }
        })
};

exports.propertyRemove = function (req, res) {
    Property.deleteOne({ _id: req.params.id })
        .then(result => {
            res.status(200).json({
                message: 'Propriedade deletada com sucesso!',
                success: true,
                result: result
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                res.status(404).json({
                    message: 'Propriedade não encontrada.',
                    success: false,
                    error: err
                });
            } else {
                res.status(500).json({
                    message: 'Ocorreu um erro ao deletar a propriedade!',
                    success: false,
                    error: err
                });
            }
        })
};