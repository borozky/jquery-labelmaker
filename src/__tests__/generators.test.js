import {assert, expect} from 'chai';
import {rootReducer} from '../scripts/store';
import { createStore } from 'redux';
import {CanvasItemGenerator, HTMLGenerator} from '../scripts/generators';
import moment from 'moment';
import $ from 'jquery';
import sampleImage from '../images/date.png';
import _ from 'lodash';

describe("Tests for CanvasItemGenerator", function() {
    test("generate: text", function() {
        let text = CanvasItemGenerator.makeText("Sample text");
        expect(text).to.include({
            ...CanvasItemGenerator.defaults,
            value: "Sample text",
            type: "TEXT"
        })
    });

    test("generate: textbox", function() {
        let textbox = CanvasItemGenerator.makeTextbox("Sample text lorem ipsum dolor sit amet");
        expect(textbox).to.include({
            ...CanvasItemGenerator.defaults,
            value: "Sample text lorem ipsum dolor sit amet",
            width: 80,
            height: 80,
            type: "TEXTBOX"
        })
    })

    test("generate: date", function() {
        let date = CanvasItemGenerator.makeDate("DD/MM/YYYY");
        expect(date).to.include({
            ...CanvasItemGenerator.defaults,
            value: moment().format("DD/MM/YYYY"),
            format: "DD/MM/YYYY",
            type: "DATE"
        })
    })

    test("generate: rectangle", function() {
        let rectangle = CanvasItemGenerator.makeRectangle(90, 1000);
        expect(rectangle).to.include({
            ...CanvasItemGenerator.defaults,
            width: 90,
            height: 1000,
            backgroundColor: "#dff0fe",
            borderColor: "#88b5df",
            borderWidth: 1,
            borderStyle: "solid",
            type: "RECTANGLE"
        })
    })

    test("generate: ellipse", function() {
        let rectangle = CanvasItemGenerator.makeEllipse(200, 600);
        expect(rectangle).to.include({
            ...CanvasItemGenerator.defaults,
            width: 200,
            height: 600,
            backgroundColor: "#dff0fe",
            borderColor: "#88b5df",
            borderWidth: 1,
            borderStyle: "solid",
            type: "ELLIPSE"
        })
    })

    test("generate: image", function() {
        let image = CanvasItemGenerator.makeImage(sampleImage);
        expect(image).to.include({
            ...CanvasItemGenerator.defaults,
            width: 80,
            height: 80,
            value: sampleImage,
            type: "IMAGE"
        })
    })

    test("generate: barcode", function() {
        let barcode = CanvasItemGenerator.makeBarcode("09909809809");
        expect(barcode).to.include({
            ...CanvasItemGenerator.defaults,
            width: 203,
            height: 132,
            displayValue: true,
            lineHeight: 100,
            lineWidth: 2,
            margin: 0,
            value: "09909809809",
            textAlign: "center",
            marginBottom: 10,
            type: "BARCODE"
        })
    })
    

    test("generate: horizontal line", function() {
        let line = CanvasItemGenerator.makeLine(400, 3, false);
        expect(line).to.include({
            ...CanvasItemGenerator.defaults,
            width: 400,
            height: 3,
            orientation: "horizontal",
            backgroundColor: "#000000",
            type: "LINE"
        })
    })

    test("generate: vertical line", function() {
        let line = CanvasItemGenerator.makeLine(800, 4, true);
        expect(line).to.include({
            ...CanvasItemGenerator.defaults,
            width: 4,
            height: 800,
            orientation: "vertical",
            backgroundColor: "#000000",
            type: "LINE"
        })
    })
})

describe("Tests from HTMLGenerator", function() {

    let $dom, sampleItems;

    beforeEach(function() {
        sampleItems = [
            {...CanvasItemGenerator.makeText("Some text")},
            {...CanvasItemGenerator.makeTextbox("Some textbox")},
            {...CanvasItemGenerator.makeDate()},
            {...CanvasItemGenerator.makeRectangle()},
            {...CanvasItemGenerator.makeEllipse()},
            {...CanvasItemGenerator.makeLine()},
            //{...CanvasItemGenerator.makeBarcode()},   // JsBarcode is a little troublesome to test
            {...CanvasItemGenerator.makeImage()},
        ].map(item => ({ ...item, id: `${item.type}_${_.uniqueId()}` }))
        $dom = new HTMLGenerator(sampleItems).getDOM();
    })

    afterEach(function() {
        sampleItems = null;
        $dom.remove();
        $dom = null;
    })

    test("generator dom has class of .canvas-parent", function() {
        expect($dom.attr("class")).to.equal("canvas-parent");
    });

    test("number of div.canvas-item and number of imported items the same", function() {
        let numItems = sampleItems.length;
        let numCanvasItems = $dom.find(".canvas-item").length;
        assert.equal(numItems, numCanvasItems);
    });

    test("each canvas item id should has id suffixed with _PREVIEW", function() {
        let $canvasItems = $dom.find(".canvas-item");
        $canvasItems.each(function() {
            let id = $(this).attr("id");
            let match = [...(/.+_PREVIEW$/).exec(id)];
            assert.lengthOf(match, 1);
        });
    });

    test("each canvas item should has valid item classes", function() {
        let $canvasItems = $dom.find(".canvas-item");
        $canvasItems.each(function() {
            let id = $(this).attr("id").replace("_PREVIEW", "");
            let item = sampleItems.filter(item => item.id === id)[0];
            assert.isTrue($(this).hasClass(item.type.toLowerCase()));
        });
    });

    test("each canvas item should has valid data-type attr", function() {
        let $canvasItems = $dom.find(".canvas-item");
        $canvasItems.each(function() {
            let id = $(this).attr("id").replace("_PREVIEW", "");
            let item = sampleItems.filter(item => item.id === id)[0];
            assert.equal($(this).attr("data-type"), item.type);
        });
    });


    test("generated TEXTs should have inner span.value with inner text", function() {
        let $textItems = $dom.find(".canvas-item[data-type='TEXT']");
        assert.isAbove($textItems.length, 0);
        $textItems.each(function() {
            let $child = $(this).find(".value");
            let id = $(this).attr("id").replace("_PREVIEW", "");
            let item = sampleItems.filter(item => item.id === id)[0];
            assert.lengthOf($child, 1);
            assert.equal($child.html(), item.value);
        });
    })

    test("generated TEXTBOXs should have inner span.value with inner text", function() {
        let $textItems = $dom.find(".canvas-item[data-type='TEXTBOX']");
        assert.isAbove($textItems.length, 0);
        $textItems.each(function() {
            let $child = $(this).find(".value");
            let id = $(this).attr("id").replace("_PREVIEW", "");
            let item = sampleItems.filter(item => item.id === id)[0];
            assert.lengthOf($child, 1);
            assert.equal($child.html(), item.value);
        });
    })

    test("generated DATEs should have inner span.value with inner text", function() {
        let $textItems = $dom.find(".canvas-item[data-type='DATE']");
        assert.isAbove($textItems.length, 0);
        $textItems.each(function() {
            let $child = $(this).find(".value");
            let id = $(this).attr("id").replace("_PREVIEW", "");
            let item = sampleItems.filter(item => item.id === id)[0];
            assert.lengthOf($child, 1);
            assert.equal($child.html(), moment(item.value, "DD-MM-YYYY hh:mm:ss a").format(item.format));
        });
    })

    test("generated RECTANGLEs should have valid size", function() {
        let $textItems = $dom.find(".canvas-item[data-type='RECTANGLE']");
        assert.isAbove($textItems.length, 0);
        $textItems.each(function() {
            let id = $(this).attr("id").replace("_PREVIEW", "");
            let item = sampleItems.filter(item => item.id === id)[0];

            expect($(this)[0].style).to.include({
                width: `${item.width}px`,
                height: `${item.height}px`,
            })
        });
    })

    test("generated ELLIPSEs should have valid size", function() {
        let $textItems = $dom.find(".canvas-item[data-type='ELLIPSE']");
        assert.isAbove($textItems.length, 0);
        $textItems.each(function() {
            let id = $(this).attr("id").replace("_PREVIEW", "");
            let item = sampleItems.filter(item => item.id === id)[0];
            
            expect($(this)[0].style).to.include({
                width: `${item.width}px`,
                height: `${item.height}px`,
            })
        });
    })

    test("generated LINEs should have valid size", function() {
        let $textItems = $dom.find(".canvas-item[data-type='LINE']");
        assert.isAbove($textItems.length, 0);
        $textItems.each(function() {
            let id = $(this).attr("id").replace("_PREVIEW", "");
            let item = sampleItems.filter(item => item.id === id)[0];
            
            expect($(this)[0].style).to.include({
                width: `${item.width}px`,
                height: `${item.height}px`,
            })
        });
    })

    test("generated IMAGEs should have img tag", function() {
        let $textItems = $dom.find(".canvas-item[data-type='IMAGE']");
        assert.isAbove($textItems.length, 0);
        $textItems.each(function() {
            let $child = $(this).find("img");
            let id = $(this).attr("id").replace("_PREVIEW", "");
            let item = sampleItems.filter(item => item.id === id)[0];
            assert.lengthOf($child, 1);
            assert.equal($child.attr("src"), item.value);
        });
    })
    

    

    
});