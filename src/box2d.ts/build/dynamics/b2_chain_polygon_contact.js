/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register(["../collision/b2_collide_edge.js", "../collision/b2_edge_shape.js", "./b2_contact.js"], function (exports_1, context_1) {
    "use strict";
    var b2_collide_edge_js_1, b2_edge_shape_js_1, b2_contact_js_1, b2ChainAndPolygonContact;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_collide_edge_js_1_1) {
                b2_collide_edge_js_1 = b2_collide_edge_js_1_1;
            },
            function (b2_edge_shape_js_1_1) {
                b2_edge_shape_js_1 = b2_edge_shape_js_1_1;
            },
            function (b2_contact_js_1_1) {
                b2_contact_js_1 = b2_contact_js_1_1;
            }
        ],
        execute: function () {
            b2ChainAndPolygonContact = class b2ChainAndPolygonContact extends b2_contact_js_1.b2Contact {
                static Create() {
                    return new b2ChainAndPolygonContact();
                }
                static Destroy(contact) {
                }
                Evaluate(manifold, xfA, xfB) {
                    const edge = b2ChainAndPolygonContact.Evaluate_s_edge;
                    this.GetShapeA().GetChildEdge(edge, this.m_indexA);
                    b2_collide_edge_js_1.b2CollideEdgeAndPolygon(manifold, edge, xfA, this.GetShapeB(), xfB);
                }
            };
            exports_1("b2ChainAndPolygonContact", b2ChainAndPolygonContact);
            b2ChainAndPolygonContact.Evaluate_s_edge = new b2_edge_shape_js_1.b2EdgeShape();
        }
    };
});
//# sourceMappingURL=b2_chain_polygon_contact.js.map