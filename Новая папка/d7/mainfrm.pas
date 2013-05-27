unit mainfrm;

interface

uses
  Windows, Messages, SysUtils, Classes, Graphics, Controls, Forms,
  Dialogs, ExtCtrls, SDL_sdlbase, SDL_plot3d;

type
  TForm1 = class(TForm)
    Plot3D1: TPlot3D;
    Timer1: TTimer;
    procedure Plot3D1BeforeRenderPolygon(Sender: TObject;
      canvas: Tcanvas; var Handled: Boolean; CellX, CellY: Integer;
      quad: TQuad; var color: TColor);
    procedure FormCreate(Sender: TObject);
    procedure Timer1Timer(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  Form1: TForm1;

implementation

{$R *.dfm}

const
  HoleXLow = 6;
  HoleXHigh = 14;
  HoleYLow = 6;
  HoleYHigh = 14;

(******************************************************************************)
procedure TForm1.Plot3D1BeforeRenderPolygon(Sender: TObject;
  canvas: Tcanvas; var Handled: Boolean; CellX, CellY: Integer;
  quad: TQuad; var color: TColor);
(******************************************************************************)

begin
if (CellX >= HoleXLow) and (CellX <= HoleXHigh) and (CellY >= HoleYLow) and (CellY <= HoleYHigh) then
  Handled := true;
end;

(******************************************************************************)
procedure TForm1.FormCreate(Sender: TObject);
(******************************************************************************)

var
  i, j : integer;

begin
Plot3D1.GridMat.Resize(30,30);
for i:=1 to 30 do
  for j:=1 to 30 do
    Plot3D1.GridMat[i,j] := sin(0.01*i*j);
Plot3D1.ColorLow := clFuchsia;
Plot3D1.ColorHigh := clBlue;
Plot3D1.ColorScaleHigh := 1;
end;

(******************************************************************************)
procedure TForm1.Timer1Timer(Sender: TObject);
(******************************************************************************)

begin
Plot3D1.ViewAngleZ := Plot3D1.ViewAngleZ - 1;
if Plot3D1.ViewAngleZ < 0 then
  Plot3D1.ViewAngleZ := 360-Plot3D1.ViewAngleZ;
end;

end.
