//Author: Meghan Nagai
//Followed Assignmnet 1 instructions and looked at Smart Phone Products
//Adapted code from Assignment 1 & 2 and added more products to create more pages
//Referenced Johnathan Kan and Lexy Dennis code

products_array=[
        {
        'jewelry': "necklaces",
        },
        {
        'jewelry': "bracelets",
        },
        {
        'jewelry': "earrings",
        },
        {
        'jewelry': "rings",
        },
];

necklaces = [
    //necklace 1
    {
        "product_name": "Curved Bar Necklace",
        "brand": "Jared",
        "price": "2499.99",
        "image": "https://www.jared.com/productimages/processed/V-211326208_0_565.jpg?pristine=true"
    },

    //necklace 2
    {
        "product_name": "Le Vian Diamond Necklace",
        "brand": "Kay",
        "price": "2297.50",
        "image": "https://www.kayoutlet.com/productimages/processed/V-476924701_0_565.jpg?pristine=true"
    },

    //necklace 3
    {
        "product_name": "Pear Halo Pendant",
        "brand": "Blue Nile",
        "price": "2390.00",
        "image": "https://bnsec.bluenile.com/bluenile/is/image/bluenile/-pear-halo-pendant-in-14k-white-gold-half-ct-tw-/79688_main?$phab_detailmain$"
    },
    //necklace 4
    {
        "product_name": "Prong-Set Diamond Solitaire Bypass Pendant",
        "brand": "Angara",
        "price": "2132.00",
        "image": "https://pics.angara.com/catalog/product/s/p/sp0892d-wg-gvs2-5.1.jpg"
    },
    //necklace 5
    {
        "product_name": "Diamond and Tanzanite Flower Pendant",
        "brand": "Tiffany & Co.",
        "price": "3000.00",
        "image": "https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-paper-flowersdiamond-and-tanzanite-flower-pendant-61625690_984447_ED.jpg"
    }
];

bracelets = [
    //bracelet 1
    {
        "product_name": "Shy Creation Diamond Bangle",
        "brand": "Jared",
        "price": "2,830.00",
        "image": "https://www.jared.com/productimages/processed/V-211601303_0_800.jpg?pristine=true"
    },

    //bracelet 2
    {
        "product_name": "Diamond Fashion Bracelet",
        "brand": "Kay",
        "price": "2,799.99",
        "image": "https://www.kay.com/productimages/processed/V-111910509_0_565.jpg?pristine=true"
    },

    //bracelet 3
    {
        "product_name": "Bezel-Set Diamond Bracelet",
        "brand": "Blue Nile",
        "price": "2,100.00",
        "image": "https://bnsec.bluenile.com/bluenile/is/image/bluenile/-white-gold-diamond-bracelet-/DB27400100_main?$phab_detailmain$"
    },
    //bracelet 4
    {
        "product_name": "Prong-Set Round Diamond Bolo Style Bracelet",
        "brand": "Angara",
        "price": "2672.00",
        "image": "https://pics.angara.com/catalog/product/SB0275D/WG/HSI2/2.5/70/1/SB0275D-WG-HSI2-2.5-70.jpg"
    },
    //bracelet 5
    {
        "product_name": "Diamond Hoop Single-row Bangle",
        "brand": "Tiffany & Co.",
        "price": "2900.00",
        "image": "https://media.tiffany.com/is/image/Tiffany/EcomItemL2/elsa-perettidiamond-hoop-single-row-bangle-60409420_973340_ED_M.jpg?&op_usm=2.0,1.0,6.0&$cropN=0.1,0.1,0.8,0.8&defaultImage=NoImageAvailableInternal&"
    }
];

earrings = [
    //earring 1
    {
        "product_name": "Lab-Created Diamond Solitaire Earrings",
        "brand": "Jared",
        "price": "2,499.99",
        "image": "https://www.jared.com/productimages/processed/V-200484602_0_800.jpg?pristine=true"
    },

    //earring 2
    {
        "product_name": "Leo Diamond Earrings",
        "brand": "Kay",
        "price": "2,624.99",
        "image": "https://www.kay.com/productimages/processed/V-182107209_0_800.jpg?pristine=true"
    },

    //earring 3
    {
        "product_name": "Pear Halo Diamond Stud Earrings",
        "brand": "Blue Nile",
        "price": "2,835.00",
        "image": "https://bnsec.bluenile.com/bluenile/is/image/bluenile/-diamond-stud-earrings-in-14k-white-gold-one-and-a-quarter-ct-tw-/80850_main?$phab_detailmain$"
    },
    //earring 4
    {
        "product_name": "Bezel and Pave Set Diamond Floral Earrings",
        "brand": "Angara",
        "price": "2,573.00",
        "image": "https://pics.angara.com/catalog/product/SE1632D/WG/HSI2/3.5/1/SE1632D-WG-HSI2-3.5.jpg"
    },
    //earring 5
    {
        "product_name": "Tiffany Fleur de Lis",
        "brand": "Tiffany & Co.",
        "price": "2700.00",
        "image": "https://i.pinimg.com/originals/89/c8/70/89c87018359f00b9c508bad9f9a35721.jpg"
    }
];

rings = [
    //ring 1
    {
        "product_name": "The Leo First Light Diamond Solitaire Ring",
        "brand": "Jared",
        "price": "2499.99",
        "image": "https://www.jared.com/productimages/processed/V-151163704_0_565.jpg?pristine=true"
    },

    //ring 2
    {
        "product_name": "Le Vian Diamond Neil Lane Engagement Ring",
        "brand": "Kay",
        "price": "2,249.99",
        "image": "https://www.kay.com/productimages/processed/V-940389012_0_565.jpg?pristine=true"
    },

    //ring 3
    {
        "product_name": "Riviera Pavé Diamond Engagement Ring",
        "brand": "Blue Nile",
        "price": "2,690.00",
        "image": "https://bnsec.bluenile.com/bluenile/is/image/bluenile/-riviera-pave-diamond-engagement-ring-platinum-/setting_template_main?$phab_detailmain$&$diam_shape=is{bluenile/main_NGN_RD_standard_100}&$diam_position=0,140&$ring_position=0,0&$ring_sku=is{bluenile/53074_NGN_setmain}"
    },
    //ring 4
    {
        "product_name": "Solitaire Cushion Diamond Twisted Wire Shank Ring",
        "brand": "Angara",
        "price": "2060.00",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrOprlsohYOLgvSAfs_xkL_RnAReHv-SWl2LHSkgE9ldIki2MGGrvCCRWrJanaHrcRx8dBsKRo&usqp=CAc"
    },
    //ring 5
    {
        "product_name": "Tiffany Soleste V Ring",
        "brand": "Tiffany & Co.",
        "price": "2300.00",
        "image": "https://media.tiffany.com/is/image/Tiffany/EcomBrowseM/tiffany-solestev-ring-60875499_977200_ED_M.jpg?&op_usm=1.75,1.0,6.0&$cropN=0.1,0.1,0.8,0.8&defaultImage=NoImageAvailableInternal&"
    }
];

var allProducts = {
    "necklaces": necklaces,
    "bracelets": bracelets,
    "earrings": earrings,
    "rings": rings, 
  }

//if inputs are not undefined export products array data
if (typeof module != 'undefined') {
    module.exports.allProducts = allProducts;
  }
