//---------------------------------------------------------------------------

#include <vcl.h>
#include <math.h>
#pragma hdrstop

#include "mainfrm.h"
//---------------------------------------------------------------------------
#pragma package(smart_init)
#pragma link "SDL_plot3d"
#pragma resource "*.dfm"
TForm1 *Form1;

//---------------------------------------------------------------------------
__fastcall TForm1::TForm1(TComponent* Owner)
        : TForm(Owner)
{
}
//---------------------------------------------------------------------------
void __fastcall TForm1::Timer1Timer(TObject *Sender)
{
Plot3D1->ViewAngleZ = Plot3D1->ViewAngleZ - 1;
if (Plot3D1->ViewAngleZ < 0)
  {
  Plot3D1->ViewAngleZ = 360-Plot3D1->ViewAngleZ;
  }
}
//---------------------------------------------------------------------------

void __fastcall TForm1::FormCreate(TObject *Sender)
{
int i,j;

Plot3D1->GridMat->Resize(30,30);
for (i=1; i<=30; i++)
  {
  for (j=1; j<=30; j++)
    {
    Plot3D1->GridMat->Elem[i][j] = sin(0.01*i*j);
    }
  }
Plot3D1->ColorLow = clFuchsia;
Plot3D1->ColorHigh = clBlue;
Plot3D1->ColorScaleHigh = 1;
Plot3D1->ViewAngleZ = 15;
}
//---------------------------------------------------------------------------
void __fastcall TForm1::Plot3D1BeforeRenderPolygon(TObject *Sender,
      TCanvas *Canvas, bool &Handled, int CellX, int CellY, TQuad &quad,
      TColor &color)
{
const int HoleXLow = 6;
const int HoleXHigh = 14;
const int HoleYLow = 6;
const int HoleYHigh = 14;

if ((CellX >= HoleXLow) && (CellX <= HoleXHigh) && (CellY >= HoleYLow) && (CellY <= HoleYHigh))
  {
  Handled = true;
  }
}
//---------------------------------------------------------------------------
