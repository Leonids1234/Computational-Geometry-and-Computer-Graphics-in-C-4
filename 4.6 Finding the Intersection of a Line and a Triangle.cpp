int lineTriangleintersect(Edge3D &e, Triangle3D &p, double &t)
{
    Point3D q;
    int aclass = e.intersect(p, t);
    if ((aclass==PARALLEL) || (aclass==COLLINEAR))
        return aclass;
    q = e.point(t);
    int h, v;
    if (p.n().dotProduct(Point3D(0,0,1)) != 0.0) {
        h = 0;
        v = 1;
    } else if (p.n().dotProduct(Point3D(1,0,0)) != 0.0){
        h = 1;
        v = 2;
    } else {
        h = 2;
        v = 0;
    }
    Polygon *pp = project(p, h, v);
    Point qp = Point(q[h], q[v]);
    int answer = pointlnConvexPolygon(qp, *pp);
    delete pp;
    return (answer ? SKEW-CROSS : SKEWNOCROSS);
}

Polygon *project(Triangle3D &p, int h, int v)
{
    // project vertices of triangle p
    Point3D a;
    Point pts[3];
    for (int i = 0; i < 3; i++) {
        a = p.v(i);
        pts[i] = Point(a[b], a[v]);
    }
    // insert first two projected vertices into polygon
    Polygon *pp = new Polygon;
    for (i = 0; i < 2; i++)
        pp->insert(pts[i]);
    // insert third projected vertex into polygon
    if (pts[2].classify(pts[0], pts[l]) == LEFT)
        pp->advance (CLOCKWISE);
    pp->insert(pts[2]);
    return pp;
}