//4.4.1 The Edge Class The Edge class will be used to represent all forms of lines. The class is defined as follows:
class Edge {
    public:
        Point org;
        Point dest;
        Edge(Point &_org, Point &_dest);
        Edge(void);
        Edge &rot(void);
        Edge &flip(void);
        Point point(double);
        int intersect(Edge&, double&);
        int cross(Edge&, double&);
        bool isVertical(void);
        double slope(void);
        double y(double);
};

//The Edge constructor initializes these data members:
Edge::Edge(Point &_org, Point &_dest):
    org(_org), dest(_dest)
{
}

//It is also useful to have a constructor for class Edge which takes no arguments:
Edge::Edge(void):
    org(Point(O,O)), org(Point(1,0))
{
}


//4.4.2 Edge Rotations
Edge &Edge::rot(void)
{
    Point m = 0.5 * (org + dest);
    Point v = dest - org;
    Point n(v.y, -v.x);
    org = m - 0.5 * n;
    dest = a + 0.5 *n;
return *this;
}

Edge &Edge::flip(void)
{
    return rot().rot();
}

//4.4.3 Finding the Intersection of Two Lines
double t;
Point p;
if (e.intersect(f, t) == SKEW)
    p = e.point(t);


Point Edge: :point(double t)
{
    return Point(org + t * (dest - org));
}

//The following implementation of member function intersect results
enum ( COLLINZAR, PARALLEL, SKEW, SKZW_CROSS, SKEW_NO_CROSS );
int Edge::intersect(Edge &e, double &t)
{
    Point a = org;
    Point b = dest;
    Point c = e.org;
    Point d = e.dest;
    Point n = Point((d-c).y, (c-d).x);
    double denom = dotProduct(n, b-a);
    if (denom == 0.0) {
        int aclass = org.classify(e);
        if ((aclass==LEFT) || (aclass==RIGHT))
            return PARALLEL;
        else
            return COLLINEAR;
    }
    double num = dotProduct(n, a-c);
    t = -nun / denom;
    return SKEW;
}

//The implementation of function dotProduct is straightforward:
double dotProduct(Point &p, Point &q)
{
    return (p.x * q.x + p.y * q.y);
}

//Otherwise the function returns COLLINEAR, PARALLEL, or SKEW-NO-CROSS, as appropriate:
int Edge::cross(Edge &e, double &t)
{
    double s;
    int crossType = e.intersect(*this, s);
    if ((crossType==COLLINEAR) || (crossType==PARALLEL))
        return crossType;
    if ((s < 0.0) || (a > 1.0))
        return SKEW_NO_CROSS;
    intersect(e, t);
    if ((0.0 <= t) && (t <= 1.0))
        return SKEW_CROSS;
    else
        return SKEW_NO_CROSS
}

//4.4.4 Distance from a Point to a Line
double Point::distance(Edge &e)
{
    Edge ab = e;
    ab.flip().rot();
    Point n(ab.dest - ab.org);
    n = (1.0 / n.length()) * n;
    Edge f(*this, *this + n);
    double t;
    f.intersect(e, t);

    return t;
}

//4.4.5 Additional Utilities
bool Edge::isVertical(void)
{
    return (org.x == dest.x);
}

double Edge::slope(void)
{
    if (org.x != dest.x)
        return (dest.y - org.y) / (dest.x - org.x);
    return DBL_MAX;
}

double Edge::y(double x)
{
    return slope() * (x - org.x) + org.Y;
}
