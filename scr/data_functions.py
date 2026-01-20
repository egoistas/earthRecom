import pandas as pd
import numpy as np      

class dataProcessor:

    # Parsing cols or datastream 
    required_cols = []


    def __init__(self, data):
        self.data = self._validate(self.data)
        
    # Extra validation method - we do more on testing    
    def _validate(self,data):
        if not self.required_cols.issubset(data.columns):
            raise ValueError("DataFrame must contain columns: 'A', 'B', 'C'")
        return data
    

    
