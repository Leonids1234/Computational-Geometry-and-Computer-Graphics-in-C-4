// 4.3 Polygons
// 4.3.3 The Vertex Class

class Vertex : public Node, public Point {
public:
	Vertex(double x, double y);
	Vertex(Point&);
	Vertex *cw(void);
	Vertex *ccw(void);
	Vertex *neighbor(int rotation);
	Point point(void);
	Vertex *insert(Vertex*);
	Vertex *remove(void);
	void splice (Vertex*);
	Vertex *split (Vertex*);
	friend class Polygon;
};


Vertex::Vertex(double x, double y) :
	Point(x,y)
{
}

Vertex::Vertex(Point &p) :
	Point (p)
{
}

Vertex *Vertex::cw(void) 
{
    return (Vertex*)_next;
}
Vertex *Vertex::ccw(void)
{
    return (Vertex*)_prev
}

Vertex *Vertex::neighbor(int rotation)
{
    return ((rotation == CLOCKWISE) ? cw() : ccwo);
}

Point Vertex::point(void)
{
    return *((Point*)this);
}

Vertex *Vertex::insert(Vertex *v)
{
    return (Vertex *)(Node::insert(v));
}
Vertex *Vertex::remove(void)
{
    return (Vertex *)(Node::remove());
}
void Vertex::splice(Vertex *b)
{
Node::splice(b)
}

// 4.3.4 The Polygon Class

class Polygon {
private:
	Vertex *_v;
	int _size;
	void resize(void);
public:
	Polygon (void);
	Polygon ( Polygon&);
	Polygon (Vertex*);
	~Polygon(void);
	Vertex *v(void);
	int size(void);
	Point point (void);
	Edge edge(void);
	Vertex *cw(void);
	Vertex *ccw(void);
	Vertex *neighbor(int rotation);
	Vertex *advance(int rotation);
	Vertex *setV(Vertex*);
	Vertex *insert(Point&);
	void remove(void);
	Polygon *split (Vertex*);
};

Polygon::Polygon(void) :
	_v(NULL), _size(O)
{
}

Polygon::Polygon(Polygon &p)
{
    size = p._size;
    if (_size == 0)
	    _v = NULL;
    else {
        _v = new Vertex(p.point());
    for (int i = 1; i < _size; i++) {
        p.advance(CLOCKWISE);
        _v = _v->insert(new Vertex(p.point()));
    }
    p.advance(CLOCKWISE);
    _v = _v->cw();
    }
}

Polygon::Polygon(Vertex *v) :
_v(v)
{
    resize();
}

void Polygon::resize(void)
{
    if (_v == NULL)
        _size = 0;
    else {
        Vertex *v = _v->cw();
    for (_size = 1; v != _v; ++_size, v = v->cw())
        ;
    }
}

Polygon::~Polygon(void)
{
    if (_v == NULL) {
        Vertex *w = _v->cw();
    while (_v != w) {
        delete w->remove();
        w = _v->cw();
    }
    delete _v;
}
}

Vertex *Polygon::v(void)
{
return _v;
}
int Polygon::size(void)
{
return _size;
}

Point Polygon::point(void)
{
return _v->point();
}
Edge Polygon::edge(void)
{
return Edge(point(), _v->cw()->point());
}

Vertex *Polygon::cw(void)
{
return v->cw();
}
Vertex *Polygon::ccw(void)
{
return _v->ccw();
}
Vertex *Polygon::neighbor(int rotation)
{
return _v->neighbor(rotation);
}

Vertex *Polygon::advance(int rotation)
{
return _v = _v->neighbor(rotation);
}

Vertex *Polygon::setV(Vertex *v) 
{
return _v = v;
}

Vertex *Polygon::insert(Point &p)
{
    if (_size++ == 0)
        _v = new Vertex(p);
    else
        _v = _v->insert(new Vertex(p));
    return _v;
}

void Polygon::remove(void)
{
    Vertex *v = _v;
    _v = (--_size == 0) ? NULL : -v->ccw();
    delete v->remove();
}

Vertex *Vertex::split(Vertex *b)
{ // insert bp before vertex b
    Vertex *bp = b->ccw()->insert(new Vertex(b->point()));
    insert(new Vertex(point())); // insert ap after this vertex
    splice(bp);
return bp;
}

Polygon *Polygon::split(Vertex *b)
{
    Vertex *bp = _v->split(b);
    resize();
    return new Polygon(bp);
}

// 4.3.5 Point Enclosure in a Convex Polygon

bool pointInConvexPolygon(Point &s, Polygon &p)
{
    if (p.size() == 1)
        return (s == p.point());
    if (p.size() == 2) {
        int c = s.classify(p.edge());
    return ((c==BETWEEN) || (c==ORIGIN) | (c==DESTINATION));
}
    Vertex *org =p.v();
    for (int i = 0; i < p.size(); i++, p.advance(CLOCKWISE))
        if (s.classify(p.edge()) == LEFT){
            p.setV(org);
        return FALSE;
        }
        return TRUE;
}

// 4.3.6 Finding the Least Vertex in a Polygon

Vertex *leastvertex(Polygon &p, int (*cmp)(Point*,Point*))
{
    Vertex *bestV = p.v();
    p.advance(CLOCKWISE);
    for (int i = 1; i < p.size(); p.advance(CLOCKWISE), i+t)
        if ((*cmp)(p.v(), bestV) < 0)
            bestV = p.v();
        p.setV(bestV);
        return bestV;
}

int leftToRightCmp(Point *a, Point *b)
{
    if (*a < *b) return -1;
    if (*a > *b) return 1;
    return 0;
}

int rightToLeftCmp(Point *a, Point *b)
{
    return leftToRightCmp(b, a);
}
