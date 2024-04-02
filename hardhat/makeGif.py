from PIL import Image 
import sys

n_frame = int(sys.argv[1])
revert = False

inDir = "examples/shapes/PNG/"
outName = "outShapes.gif"

inDir = "examples/paths/PNG/"
outName = "outPaths.gif"

images = []
for i in range(n_frame):

    filename = inDir + "token" + str(i) 

    print ("Including frame " + filename+".png")
    img = Image.open(filename+".png")
    #img = img.convert("RGB")
    images.append(img)
if revert == True: 
    revImg = list(images)
    revImg.reverse()
    revImg = revImg[1:]
    images = images+revImg
print ("Producing gif file " + outName)
images[0].save(outName, save_all=True, append_images=images[1:], optimize=True, duration=1200, loop=0)
