from PIL import Image 
import sys

n_frame = int(sys.argv[1])
revert = False

images = []

inDir = "examples/shapes/"
inDir2 = "examples/paths/"

for i in range(n_frame):

    filename = inDir + "token" + str(i) 
    print ("Including frame " + filename+".png")    
    img = Image.open(filename+".png")
    #img = img.convert("RGB")
    images.append(img)

    filename = inDir2 + "token" + str(i) 
    print ("Including frame " + filename+".png")    
    img = Image.open(filename+".png")
    #img = img.convert("RGB")
    images.append(img)

if revert == True: 
    revImg = list(images)
    revImg.reverse()
    revImg = revImg[1:]
    images = images+revImg

outName = "xonin.gif"
print ("Producing gif file " + outName)
images[0].save(outName, save_all=True, append_images=images[1:], optimize=True, duration=1000, loop=0)
