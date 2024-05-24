//4.5.1 Point
class Point3D {
    public:
        double x;
        double y;
        double z;
        Point3D(double _x, double _y, double _z):
            x(_x), y(_y), z(_z) {}
        Point3D(void)
            {}
        Point3D operator+(Point3D &p)
            { return Point3D(x + p.x, y + p.y, z + p.z); }
        Point3D operator-(Point3D &p)
            { return Point3D(x - p.x, y - p.y, z - p.z); }
        friend Point3D operator*(double, Point3D &);
        int operator==(Point3D &p)
            { return ((x == p.x) && (y == p.y) && (z == p.z));}
        int operator!=(Point3D &p)
            { return !(*this == p); }
        double operator[](int i)
            { return ((i == 0) ? x : ((i == 1) ? y : z)); }
        double dotProduct(Point3D &p)
            { return (x*p.x + y*p.y + z*p.z); }
        int classify(Triangle3D &t);
};

//Scalar multiplication is implemented like this:
Point3D operator*(double s, Point3D &p)
{
    return Point3D(s * p.x, s * p.y, s * p.z);
}


//4.5.2 Triangles
Point3D crossProduct(Point3D &a, Point3D &b)
{
    return Point3D(a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x);
}

//Having discussed bounding boxes and normal vectors, wecan define the Triangle3D class:
class Triangle3D {
    private:
        Point3D _v[3];
        Edge3D _boundingBox;
        Point3D _n;
    public:
        int id;
        int mark;
        Triangle3D(Point3D &vO, Point3D &v1, Point3D &v2, int id);
        Triangle3D(void)
        {}
        Point3D operatort[](int i)
            { return _v[i]; }
        Edge3D boundingBox()
            { return _boundingBox; }
        Point3D n(void)
            { return _n;}
        double length(void)
            { return sqrt(x*x + y*y + z*z);}
};

//The first constructor Triangle3 makes use of the macro functions max3 and min3 for finding the largest and smallest of three numbers:
#define min3(A,B,C) \\ 
    ((A)<(B) ? ((A)<(C)?(A):(C)) : ((B)<(C)?(B):(C)))
#define max3(A,B,C) \\
    ((A)>(B) ? ((A)>(C)?(A):(C)) : ((B)>(C)?(B):(CM)))
Triangie3D::Triangle3D(Point3D &vO, Point3D &vl, Point3D &v2, int _id)
{
    id = _id;
    mark = 0;
    _v[O] = vO;
    _v[1]0= v1;
    _v[2] = v2;
    _boundingBox.org.x = min3(vO.x, vl.x, v2.x);
    _boundingBox.org.y = min3(vO.y, vl.y, v2.y);
    _boundingBox.org.z = min3(vO.z, vl.z, v2.z);
    _boundingBox.dest.x = max3(vO.x, vl.x, v2.x);
    _boundingBox.dest.y = max3(vO.y, vl.y, v2.y);
    _boundingBox.dest.z = _ax3(vO.z, vl.z, v2.z);
    _n = crossProduct(vl - vO, v2 - v0);
    _n = (1.0 / _n.length()) * _n;
}

#define EPSILON1 1E-12
enum { POSITIVE, NEGATIVE, ON };

int Point3::classify(Triangle3 &p)
{
    Point3 v = *this - p[0];
    double len = v.length();
    if (len == 0.0)
        return ON;
    v = (1.0 / len) * v;
    double d = v.dotProduct(p.n());
    if (d > EPSILON1)
        return POSITIVE;
    else if (d < -EPSILONI)
        return NEGATIVE;
    else
        return ON;
}

//4.5.3 Edges
//The Edge3D class is defined as follows
class Edge3D {
    public:
        Point3D org;
        Point3D dest;
        Edge3D(Point3D &_org, Point3D &_dest)
            org(_org), dest(_dest) {}
        Edge3D(void)
            {}
        int intersect(Triangle3D &p, double &t);
        Point3D point(double t);
};

//Like its counterpart Edge: : intersect, member function intersect is implemented using Equation 4.4:
int Edge3D::intersect(Triangle3D &p, double &t)
{
    Point3D a = org;
    Point3D b = dest;
    Point3D c = p[O]; // some point on the plane
    Point3 n = p.n();
    double denom = n.dotProduct(b - a);
    if (denom == 0.0) {
        int aclass = org.classify(p);
        if (aclass!=ON)
            return PARALLEL;
        else
            return COLLINEAR;
    }
    double num = n.dotProduct(a - c);
    t = -nun / denom;
    return SKEW;
}

//Member function po int returns the point along this line corresponding to parametric value t:
Point3D Edge3D::point(double t)
{
    return org + t * (dest - org);
}