import Nightmare from 'nightmare';
import {assert} from 'chai';
import $ from 'jquery';

const url = "http://localhost:3000";

Nightmare.action( 'focus', function ( selector, done ) {
    this.evaluate_now(( selector ) => {
      document.activeElement.blur();
      var element = document.querySelector( selector );
      element.focus();
    }, done, selector );
  });


describe("Test: TEXT", function() {

    var browser = Nightmare({
        show: true
    });

    beforeEach(function() {
        browser.goto(url);
    })

    afterAll(function() {
        console.log("END");
        browser.end();
    })

    test("Text updated when typing", async function(done) {
        browser
        .click('div#LeftSidebar > ul:nth-child(1) > li.item-types:nth-child(1) > img:nth-child(1)')
        .type('div#ValueControl > input:nth-child(2)', "")
        .type('div#ValueControl > input:nth-child(2)', "Sample text")
        try {
            let result = await browser.evaluate(() => {
                var element = document.querySelector("#AppCanvas .canvas-item.text .value");
                var elementID = document.querySelector("#AppCanvas .canvas-item.text").getAttribute("id");
                var itemNavigation = document.querySelector("#" + elementID + "_REF");
                return {
                    innerText: element.innerHTML,
                    itemNavText: itemNavigation.innerHTML
                }
            })

            assert.equal(result.innerText, "Sample text");
            assert.equal(result.itemNavText, "Sample text");
            done();
        } catch(error) {
            done.fail(error);
        }
    });

    test("Text item navigation uses its ID when text value is blank", async function(done) {
        browser
        .click('div#LeftSidebar > ul:nth-child(1) > li.item-types:nth-child(1) > img:nth-child(1)')
        .type('div#ValueControl > input:nth-child(2)', false)
        .type('div#ValueControl > input:nth-child(2)', " ")

        try {
            let result = await browser.evaluate(() => {
                var element = document.querySelector("#AppCanvas .canvas-item.text .value");
                var elementID = document.querySelector("#AppCanvas .canvas-item.text").getAttribute("id");
                var itemNavigation = document.querySelector("#" + elementID + "_REF");
                return {
                    innerText: element.innerHTML,
                    itemNavText: itemNavigation.innerHTML,
                    itemID: elementID
                }
            })

            assert.equal(result.innerText, " ");
            assert.equal(result.itemNavText, result.itemID);
            done();
        } catch(error) {
            done.fail(error);
        }
    });

});
