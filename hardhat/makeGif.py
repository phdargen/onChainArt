from PIL import Image 
import sys

n_frame = int(sys.argv[1])
revert = False
outName = "out.gif"

images = []
for i in range(n_frame):

    filename = "token" + str(i+1) 

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
images[0].save(outName, save_all=True, append_images=images[1:], optimize=True, duration=600, loop=0)
