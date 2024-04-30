// 4.2 Points
// 4.2.1 The Point Class

class Point {

public:

double x;
double y;
Point(double _x = 0.0, double _y = 0.0);
Point operator+(Point&);
Point operator-(Point&);
friend Point operator*(double, Point&);
double operator[](int);
int operator==(Point&);
int operator!=(Point&);
int operator<(Point&);
int operator>(Point&);
int classify(Point&, Point&);
int classify(Edge&);
double polarAngle(void);
double length(void);
double distance(Edge&);

};

// 4.2.2 Constructors

Point::Point(double _x, double _y) :
x(_x), y(_y)
{
}

// 4.2.3 Vector Arithmetic

Point Point::operator+(Point &p)
{
return Point(x + p.x, y + p.y);
}
Point Point::operator-(Point &p)
{
return Point(x - p.x, y - p.y);
}

Point operator*(double s, Point &p) 
{
return Point(s * p.x, s * p.y);
}

double Point::operator[](int i)
{
return (i == 0) ? x : y;
}

// 4.2.4 Relational Operators

int Point::operator==(Point &p)
{
return (x == p.x) && (y == p.y);
}
int Point::operator!=(Point &p)
{
return !(*this == p);
}

int Point::operator<(Point &p)
{
return ((x < p.x) 1 ((x == p.x) && (y < p.y)));
}
int Point::operator>(Point &p)
{
return ((x > p.x) | ((x == p.x) && (y > p.y)));
}

int orientation(Point &pO, Point &pl, Point &p2)
{
	Point a = p2 - pO;
	Point b = p2 - p0;
	double sa = a.x * b.y - b.x * a.y;
	if (sa > 0.0)
		return 1;
	if (sa < 0.0)
		return -1;
	return 0;
}

// 4.2.5 Point-Line Classification

enum { LEFT, RIGHT, BEYOND, BEHIND, BETWEEN, ORIGIN, DESTINATION };
int Point::classify(Point &pO, Point &p1)
{
	Point p2 = *this;
	Point a = pl - p0;
	Point b = p2 - p0;
	double sa = a.x * b.y - b.x * a.y;
	if (sa > 0.0)
		return LEFT;
	if (sa < 0.0)
		return RIGHT;
	if ((a.x * b.x < 0.0) || (a.y * b.y < 0.0))
		return BEHIND;
	if (a.length() < b.length())
		return BEYOND;
	if (p0 == p2)
		return ORIGIN;
	if (pl == p2)
		return DESTINATION
	return BETWEEN;
}

int Point::classify(Edge &e)
{
return classify(e.org, e.dest)
}

double Point::polarAngle (void)
{
	if ((x == 0.0) && (y == 0.0))
		return -1.0;
	if (x == 0.0)
		return ((y > 0.0) ? 90 : 270);
	double theta = atan(y / x); // in radians
	theta *= 360 / (2 * 3.1415926); // convert to degrees
	if (x > 0.0) // quadrants 1 and 4
		return ((y >= 0.0) ? theta : 360 + theta);
	else // quadrants 2 and 3
		return (180 + theta);
}

double Point::length(void)
{
return sqrt(x*x + y*y);
}