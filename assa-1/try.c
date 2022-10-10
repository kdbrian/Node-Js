#include <stdio.h>

int main(){

/*
    printf("* * * * * * * * * * * * * * * * *\n");
    printf("*       *       *       *       *\n");
    printf("*       *       *       *       *\n");
    printf("*       *       *       *       *\n");
    printf("* * * * * * * * * * * * * * * * *\n");
    printf("*       *       *       *       *\n");
    printf("*       *       *       *       *\n");
    printf("*       *       *       *       *\n");
    printf("* * * * * * * * * * * * * * * * *\n");
    printf("*       *       *       *       *\n");
    printf("*       *       *       *       *\n");
    printf("*       *       *       *       *\n");
    printf("* * * * * * * * * * * * * * * * *\n");
    printf("*       *       *       *       *\n");
    printf("*       *       *       *       *\n");
    printf("*       *       *       *       *\n");
    printf("* * * * * * * * * * * * * * * * *\n");
*/
    
    for(int i= 0; i <17; ++i){
        for(int j=0;j< 17;j++){

            if(i==0 || i==4 || i==8 || i==12 || i==16){
                printf("* ");
            }else if(j==0 || j==4 || j==8 || j==12 || j==16){
                printf("*    ");
            }else{
                printf(" ");
            }
        }
        printf("\n");
    }
    return 0;
}