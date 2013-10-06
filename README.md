Bootstrap 3 Lightbox
========

A lightbox module for Bootstrap that supports images, YouTube videos, and galleries - built around Bootstrap's Modal plugin.

Usage
====

Obviously, you need the modal component that comes with Bootstrap, and jQuery.
            
Via data attributes
-------------------

            <a href="someurl" data-title="My First Lightbox" data-toggle="lightbox">Launch modal</a>
            
Via Javascript
--------------

            <a href="someurl" id="mylink">Open lightbox</a>
            
            $('#mylink').lightbox({source:'someurl',title:'My First LightBox'});

Options
=======

<table>
    <thead>
    <tr>
        <th>Name</th>
        <th>type</th>
        <th>default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>source</td>
        <td>string</td>
        <td></td>
        <td>If you can't/don't want to set the href property of an element, use <code>data-source="something"</code></td>
    </tr>
    <tr>
        <td>title</td>
        <td>string</td>
        <td></td>
        <td>Set the title of your lightbox (this will add a close button too)</td>
    </tr>
    <tr>
        <td>footer</td>
        <td>string</td>
        <td></td>
        <td>Set the footer</td>
    </tr>
    <tr>
        <td>gallery</td>
        <td>string</td>
        <td></td>
        <td>For grouping elements</td>
    </tr>
    </tbody>
</table>
